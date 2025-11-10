import prisma from "../../config/prisma.config.js";

export async function findUserProfileByToken(user_id){
  return prisma.user.findUnique({
    where: { user_id },
    select: {
      user_id: true,
      email: true,
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

export async function findUserProfileRepository(userId){
  const userData = await prisma.user.findUnique({
    where: { user_id: userId },
    select: {
      email: true,
      nick_name: true,
      role: true,
    },
  });

  const countChallenges = await prisma.challenge.findMany({
    where: {
      user_id: userId,
    }
  });
  const challengeCount = countChallenges.length;

  const countWorks = await prisma.attend.findMany({
    where: {
      user_id: userId,
      is_delete: false,
    }
  });
  const workCount = countWorks.length;

  return {...userData, challengeCount, workCount};

}

export async function getUserWorkIdRepository(userId, challengeId){
  const workIdData = await prisma.attend.findMany({
    where: {
      user_id: userId,
      challenge_id: challengeId,
    },

    select: {
      attend_id: true,
      is_delete: true,
    }
  });

  return workIdData;
}