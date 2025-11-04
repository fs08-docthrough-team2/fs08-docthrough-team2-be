import prisma from "../../config/prisma.config.js";

export async function findUserProfileByToken(user_id){
  return prisma.user.findUnique({
    where: { user_id },
    select: {
      user_id: true,
      nick_name: true,
      role: true,
    },
  });
}