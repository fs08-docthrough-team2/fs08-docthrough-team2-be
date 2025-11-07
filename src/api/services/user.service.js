
import {
  findUserProfileByToken,
  updateUser,
  deleteUser,
} from "../repositories/user.repository.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { updateRefreshToken } from "../repositories/token.repository.js";
import { NotFoundError, UnauthorizedError, BadRequestError, ConflictError } from '../../utils/error.util.js';

export async function getUserProfileFromToken(tokenPayload){
  const { userId } = tokenPayload;
  const user = await findUserProfileByToken(userId);
  if(!user)
    throw new NotFoundError(
      `사용자 ID '${userId}'에 해당하는 프로필을 찾을 수 없습니다. 사용자가 존재하지 않거나 삭제되었을 수 있습니다. 다시 로그인해주세요.`,
      'USER_NOT_FOUND'
    );

  const data ={
    userId,
    email: user.email,
    nickName: user.nick_name,
    role: user.role,
  }
  return{ user: data }
}



export async function getUserFromToken(req){
  let token = null;
  if(req.cookies?.accessToken){
    token = req.cookies.accessToken;
  }

  else if(req.headers.authorization?.startsWith("Bearer ")){
    token = req.headers.authorization.split(" ")[1];
  }

  if(!token)
    throw new UnauthorizedError(
      "인증 토큰이 제공되지 않았습니다. 이 작업을 수행하려면 로그인이 필요합니다. Authorization 헤더에 'Bearer {token}' 형식으로 Access Token을 포함하거나 쿠키에 accessToken을 포함해주세요.",
      'MISSING_AUTH_TOKEN'
    );

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const { user }= await getUserProfileFromToken(decoded);
  return { ...user, userId: decoded.userId};
}


export async function updateUserProfile(req){
  const { userId } = await getUserFromToken(req);
  const { nickName, password } = req.body;

  const updateData = {};

  if(nickName){
    updateData.nick_name = nickName;
  }

  if(password){
    updateData.password = await argon2.hash(password);
  }

  if(Object.keys(updateData).length === 0)
    throw new BadRequestError(
      "수정할 항목이 제공되지 않았습니다. 프로필을 수정하려면 최소한 하나의 필드(nickName 또는 password)를 요청 본문에 포함해주세요. 예: {\"nickName\": \"새닉네임\"} 또는 {\"password\": \"새비밀번호\"}",
      'NO_UPDATE_FIELDS'
    );

  const updated = await updateUser(userId,  updateData);
  
  return{
    message: "내 정보 수정 완료",
    user: updated,
  };
}

export async function deleteUserProfile(req){
  const { userId } = await getUserFromToken(req);

  const user = await findUserProfileByToken(userId);
  if(!user)
    throw new NotFoundError(
      `사용자 ID '${userId}'에 해당하는 계정을 찾을 수 없습니다. 이미 삭제되었거나 존재하지 않는 계정입니다.`,
      'USER_NOT_FOUND'
    );

  if(user.isDelete)
    throw new ConflictError(
      "이미 탈퇴 처리된 계정입니다. 탈퇴한 계정은 다시 탈퇴할 수 없습니다. 새로운 계정이 필요한 경우 회원가입을 진행해주세요.",
      'ALREADY_DELETED'
    );
  
  await deleteUser(userId);

  await updateRefreshToken(userId, "");
  
  return { message: "회원 탈퇴"};
}