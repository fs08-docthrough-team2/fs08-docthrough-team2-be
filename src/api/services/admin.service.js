import {
  findAllUsers,
  findUserByEmailAdmin,
  changeUserRoleByEmail,
}
from "../repositories/admin.repository.js";
import { findUserByEmail } from "../repositories/auth.repository.js";

export async function getAllUsers({ page, limit, search }){
  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10;
  const searchKeyword = search?.trim() || "";
  const users = await findAllUsers({ page: pageNum, limit: limitNum, search: searchKeyword});
  
  return users;
}

export async function getUserByEmail(email) {
  const user = await findUserByEmailAdmin(email);
  if(!user) {
    const err = new Error("해당 이메일의 사용자를 찾을 수가 없습니다.");
    err.status = 400
    throw err;
  }
  return user; 
}

export async function updateUserRoleByEmail(email, role) {
  const validRoles = ["USER","EXPERT","ADMIN"]
  if(!role || !validRoles.includes(role.toUpperCase())){
    const error = new Error("유효하지 않은 값입니다.");
    error.status = 400;
    throw error;
  }

  const existingUser = await findUserByEmailAdmin(email);
  if(!existingUser){
    const error = new Error("해당 이메일의 사용자를 찾을 수 없습니다.");
    error.status = 404;
    throw error;
  }

  if(existingUser.role === role.toUpperCase()){
    return{
      message: "이미 해당 직급입니다.",
      user: existingUser,
    };
  }

  const updateUser = await changeUserRoleByEmail(email, role.toUpperCase());

  return{
    user: updateUser,
  }
}