import prisma from "../../config/prisma.config.js"


// id로 찾기
export async function findUserById(user_id){
  return prisma.user.findUnique({
    where: {
      user_id,
    },
  });
}

// 이메일로 찾기
export async function findUserByEmail(email){
  return prisma.user.findUnique({
    where: {
      email,
    }
  })
}

// 사용자 생성
export async function createUser(data){
  return prisma.user.create({ data });
}

export async function findUserByNickName(nick_name){
  return prisma.user.findFirst({
    where: { 
      nick_name 
    },
  });
}