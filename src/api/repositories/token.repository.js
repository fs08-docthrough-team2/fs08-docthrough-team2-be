import prisma from "../../config/prisma.config.js"

export async function findUserByRefreshToken(token) {
  if (!token || typeof token !== "string" || token.trim() === "") {
    return null;
  }

  return prisma.user.findFirst({
    where: { refresh_token: token },
    select: {
      user_id: true,
      email: true,
      nick_name: true,
      role: true,
      refresh_token: true,
    },
  });
}


export async function updateRefreshToken(user_id, token) {
  return prisma.user.update({
    where: { user_id },
    data: { refresh_token: token },
    select: { 
      user_id: true, 
      refresh_token:true
    },
  });
}


