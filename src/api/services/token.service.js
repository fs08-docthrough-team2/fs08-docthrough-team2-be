import jwt from "jsonwebtoken"
import {
  findUserByRefreshToken,
  updateRefreshToken,

} from  "../repositories/token.repository.js"

import dotenv from "dotenv";

dotenv.config();


export async function verifyAccessToken(refreshToken) {
  if (!refreshToken) {
    throw new Error("Refresh Token이 없습니다.");
  }

  const user = await findUserByRefreshToken(refreshToken);
  if (!user) {
    throw new Error("유효하지 않은 Refresh Token입니다.");
  }

  try {
    jwt.verify(refreshToken, process.env.JWT_SECRET);
  } 
  catch (err) {
    throw new Error("Refresh Token이 만료되었거나 유효하지 않습니다.");
  }

  return {
    user: {
      email: user.email,
      nickName: user.nick_name,
      role: user.role,
    },
  };
}

//DB 확인 + Access Token 발급
export async function refreshAccessToken(refreshToken){
  if(!refreshToken)
    throw new Error('Refresh Token이 없습니다.');
  
  const user = await findUserByRefreshToken(refreshToken);
  if(!user)
    throw new Error('유효하지 않은 토큰입니다.');

  try{
    jwt.verify(refreshToken, process.env.JWT_SECRET);
  }
  catch(e){
    throw new Error("Refresh Token이 만료되거나 유효하지 않습니다.")
  }

const newAccessToken = jwt.sign(
  { userId: user.user_id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
);

  const newRefreshToken = jwt.sign(
    { userId: user.user_id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d" }
  )

  await updateRefreshToken(user.user_id, newRefreshToken);


  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    user: {
      email: user.email,
      nickName: user.nick_name,
      role: user.role,
    },
  };
}