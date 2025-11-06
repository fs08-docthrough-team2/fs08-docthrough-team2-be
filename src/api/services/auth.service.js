import * as argon2 from "argon2";
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
import { ConflictError, UnauthorizedError, BadRequestError } from '../../utils/error.util.js';
dotenv.config();

export async function signup(email, password, nickName) {
  const existing = await findUserByEmail(email);
  if (existing)
    throw new ConflictError(
      `이메일 '${email}'은(는) 이미 등록되어 있습니다. 다른 이메일 주소를 사용하거나 로그인을 시도해주세요.`,
      'DUPLICATE_EMAIL'
    );

  const existingNickName = await findUserByNickName(nickName);
  if(existingNickName)
    throw new ConflictError(
      `닉네임 '${nickName}'은(는) 이미 사용 중입니다. 다른 닉네임을 선택해주세요. 닉네임은 고유해야 하며, 다른 사용자와 중복될 수 없습니다.`,
      'DUPLICATE_NICKNAME'
    );

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
    // 수정된 부분
    // https://github.com/fs08-docthrough-team2/fs08-docthrough-team2-be/commit/daffca0dfbf4316d0a58db8745e6f9b80e7a1c9a
    userId: user.user_id,
    email: user.email,
    nickName: user.nick_name,
    role: user.role,
    accessToken, 
    refreshToken,
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
    throw new UnauthorizedError(
      `이메일 '${email}'로 등록된 사용자를 찾을 수 없습니다. 이메일 주소를 확인하거나 회원가입을 진행해주세요.`,
      'USER_NOT_FOUND'
    );

  const match = await argon2.verify(user.password, password);
  if (!match)
    throw new UnauthorizedError(
      '입력하신 비밀번호가 올바르지 않습니다. 비밀번호는 대소문자를 구분하며, 등록 시 설정한 비밀번호와 정확히 일치해야 합니다. 비밀번호를 잊으셨다면 비밀번호 재설정을 이용해주세요.',
      'INVALID_PASSWORD'
    );

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
    userId: user.user_id,
    email: user.email,
    nickName: user.nick_name,
    role: user.role,
    accessToken,
    refreshToken,
  };
}

export async function logout(refreshToken) {
  if (!refreshToken) {
    throw new BadRequestError(
      "Refresh Token이 제공되지 않았습니다. 로그아웃을 하려면 유효한 Refresh Token이 필요합니다. 쿠키가 만료되었거나 삭제된 경우 다시 로그인해주세요.",
      'MISSING_REFRESH_TOKEN'
    );
  }

  const user = await findUserByRefreshToken(refreshToken);
  if (!user) {
    throw new UnauthorizedError(
      "제공된 Refresh Token이 유효하지 않습니다. Token이 만료되었거나, 이미 로그아웃된 상태이거나, 잘못된 Token입니다. 다시 로그인해주세요.",
      'INVALID_REFRESH_TOKEN'
    );
  }

  await updateRefreshToken(user.user_id, " ");

  return { message: "로그아웃 완료" };
}