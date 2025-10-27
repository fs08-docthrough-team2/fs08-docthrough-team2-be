import { Prisma } from "@prisma/client";
import prisma from "../../common/prisma.js"

export async function findAllUsers({ page, limit, search }) {
  const skip = (page - 1) * limit;

  let where = {};

  if (search && search.trim() !== "") {
    where = {
      OR: [
        { email: { contains: search, mode: "insensitive" } },
        { nick_name: { contains: search, mode: "insensitive" } },
      ],
    };
  }

  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        email: true,
        nick_name: true,
        role: true,
        isDelete: true,
        created_at: true,
      },
      orderBy: { created_at: "desc" },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    totalCount,
    currentPage: page,
    totalPage: Math.ceil(totalCount / limit),
  };
}




export async function findUserByEmailAdmin(email) {
  return prisma.user.findUnique({
    where: { email },
    select: {
      email: true,
      nick_name: true,
      role: true,
      isDelete: true,
      created_at: true,
    },
  });
}

export async function changeUserRoleByEmail(email, role){
  return prisma.user.update({
    where: { email },
    data: { role },
    select: {
      user_id: true,
      email: true,
      nick_name: true,
      role: true,
    },
  });
}
