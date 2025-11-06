import jwt from "jsonwebtoken"
import {
  findUserByRefreshToken,
  updateRefreshToken,

} from  "../repositories/token.repository.js"

import dotenv from "dotenv";
import { BadRequestError, UnauthorizedError } from '../../utils/error.util.js';

dotenv.config();


export async function verifyAccessToken(refreshToken) {
  if (!refreshToken) {
    throw new BadRequestError(
      "Refresh Token이 제공되지 않았습니다. 요청에 유효한 Refresh Token을 포함해주세요. 쿠키가 삭제되었거나 만료된 경우 다시 로그인해주세요.",
      'MISSING_REFRESH_TOKEN'
    );
  }

  const user = await findUserByRefreshToken(refreshToken);
  if (!user) {
    throw new UnauthorizedError(
      "제공된 Refresh Token을 데이터베이스에서 찾을 수 없습니다. Token이 유효하지 않거나, 이미 로그아웃되었거나, 삭제된 사용자의 Token입니다. 다시 로그인해주세요.",
      'INVALID_REFRESH_TOKEN'
    );
  }

  try {
    jwt.verify(refreshToken, process.env.JWT_SECRET);
  }
  catch (err) {
    throw new UnauthorizedError(
      "Refresh Token의 서명 검증에 실패했습니다. Token이 만료되었거나, 변조되었거나, 잘못된 서명입니다. 보안을 위해 다시 로그인해주세요.",
      'TOKEN_VERIFICATION_FAILED'
    );
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
    throw new BadRequestError(
      'Refresh Token이 제공되지 않았습니다. Access Token을 갱신하려면 유효한 Refresh Token이 필요합니다. 쿠키가 삭제되었거나 만료된 경우 다시 로그인해주세요.',
      'MISSING_REFRESH_TOKEN'
    );

  const user = await findUserByRefreshToken(refreshToken);
  if(!user)
    throw new UnauthorizedError(
      '제공된 Refresh Token을 데이터베이스에서 찾을 수 없습니다. Token이 유효하지 않거나, 이미 로그아웃되었거나, 삭제된 사용자의 Token입니다. 다시 로그인해주세요.',
      'INVALID_REFRESH_TOKEN'
    );

  try{
    jwt.verify(refreshToken, process.env.JWT_SECRET);
  }
  catch(e){
    throw new UnauthorizedError(
      "Refresh Token의 서명 검증에 실패했습니다. Token이 만료되었거나, 변조되었거나, 잘못된 서명입니다. 보안을 위해 다시 로그인해주세요.",
      'TOKEN_VERIFICATION_FAILED'
    );
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