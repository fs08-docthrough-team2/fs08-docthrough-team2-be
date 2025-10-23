import prisma from '../common/prisma.js';

export async function findUserById(user_id) {
  return prisma.user.findUnique({
    where: {
      user_id,
    },
  });
}

export async function findUserByEmail(email) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export async function CreateUser(data) {
  prisma.user.create({ data });
}

export async function updateRefreshToken(user_id, refresh_token) {
  return prisma.user.update({
    where: {
      userId: user_id,
    },
    data: {
      refreshToken: refresh_token,
    },
  });
}
