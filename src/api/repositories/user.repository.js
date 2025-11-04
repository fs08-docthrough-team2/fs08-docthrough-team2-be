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

export async function updateUser(user_id, updateData){
  return prisma.user.update({
    where: { user_id },
    data: updateData,
    select: {
      user_id: true,
      nick_name: true,
      role: true,
    },
  });
}


export async function deleteUser(user_id) {
  return prisma.user.update({
    where: { user_id },
    data: { isDelete: true },
    select: {
      user_id: true,
    },
  });
}
