
import { 
  findUserProfileByToken,
  updateUser,
  deleteUser,
} from "../repositories/user.repository.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { updateRefreshToken } from "../repositories/token.repository.js";

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



export async function getUserFromToken(req){
  let token = null;
  if(req.cookies?.accessToken){
    token = req.cookies.accessToken;
  }

  else if(req.headers.authorization?.startsWith("Bearer ")){
    token = req.headers.authorization.split(" ")[1];
  }

  if(!token) 
    throw new Error("인증 토큰이 없습니다.");

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await getUserProfileFromToken(decoded);
  
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
    throw new Error("수정할 항목이 없습니다.");

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
    throw new Error("존재하지 않은 사용자 입니다.");

  if(user.isDelete) 
    throw new Error("이미 탈퇴한 사용자 입니다.");
  
  await deleteUser(userId);

  await updateRefreshToken(userId, "");
  
  return { message: "회원 탈퇴"};
}