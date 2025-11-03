import argon2 from "argon2";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import {
  findUserByEmail,
  findUserByNickName,
  createUser,
} 
from '../repositories/auth.repository.js';
import {
  findUserByRefreshToken,
  updateRefreshToken,
} 
from "../repositories/token.repository.js"
dotenv.config();

export async function signup(email, password, nickName) {
  const existing = await findUserByEmail(email);
  if (existing) 
    throw new Error("이미 등록된 이메일입니다.");

  const existingNickName = await findUserByNickName(nickName);
  if(existingNickName)
    throw new Error("이미 사용 중인 닉네임입니다.");

  const hashed = await argon2.hash(password);

  const user = await createUser({
    email,
    password: hashed,
    nick_name: nickName,
    role: "USER",
    refresh_token: "", 
  });

  // 회원가입 후 바로 토큰 발급
  const { accessToken, refreshToken } = await generateTokens(user);
  await updateRefreshToken(user.user_id, refreshToken);

  return { 
    accessToken, 
    refreshToken,
    user:{
      email: user.email,
      nickName: user.nick_name,
      role: user.role,
    } 
  };
}

export async function generateTokens(user) {
  const accessToken = jwt.sign(
    { userId: user.user_id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );

  const refreshToken = jwt.sign(
    { userId: user.user_id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d" }
  );

  await updateRefreshToken(user.user_id, refreshToken);

  return { accessToken, refreshToken };
}

export async function login(email, password) {
  const user = await findUserByEmail(email);

  if (!user || user.isDelete) 
    throw new Error('존재하지 않는 사용자입니다.');

  const match = await argon2.verify(user.password, password); 
  if (!match) 
    throw new Error('비밀번호가 올바르지 않습니다.');

  const accessToken = jwt.sign(
    { userId: user.user_id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d"},
  );

  const refreshToken = jwt.sign(
    { userId: user.user_id }, 
    process.env.JWT_SECRET, 
    {expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d"}
  );

  await updateRefreshToken( user.user_id, refreshToken );

  return { 
    accessToken, 
    refreshToken,
    user:{
      email: user.email,
      nickName: user.nick_name,
      role: user.role,
    } 
  };
}

export async function logout(refreshToken) {
  if (!refreshToken) {
    throw new Error("Refresh Token이 없습니다.");
  }

  const user = await findUserByRefreshToken(refreshToken);
  if (!user) {
    throw new Error("유효하지 않은 Refresh Token입니다.");
  }

  await updateRefreshToken(user.user_id, " ");

  return { message: "로그아웃 완료" };
}