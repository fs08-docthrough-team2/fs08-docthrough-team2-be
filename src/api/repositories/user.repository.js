import prisma from "../../common/prisma.js";

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