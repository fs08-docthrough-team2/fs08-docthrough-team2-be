import { findUserProfileByToken } from "../repositories/user.repository.js";

export async function getUserProfileFromToken(tokenPayload){
  const { userId } = tokenPayload;
  const user = await findUserProfileByToken(userId);
  if(!user)
    throw new Error("사용자를 찾을 수 없습니다.");

  return{
    nickName: user.nick_name,
    role: user.role,
  }
}