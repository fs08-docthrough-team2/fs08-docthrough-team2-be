import { findUserProfileByToken } from "../repositories/user.repository.js";
import jwt from "jsonwebtoken";

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
