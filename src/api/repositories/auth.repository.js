import prisma from "../../common/prisma.js"


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

// // 토큰 갱신
// export async function updateRefreshToken(user_id, refresh_token){
//   return prisma.user.update({
//     where:{
//       userId:user_id,
//     },
//     data: {
//       refreshToken: refresh_token
//     },
//   });
// };