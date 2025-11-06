import prisma from "../../config/prisma.config.js"

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
  const SetUser = users.map((u) =>({
    userId: u.user_id,
    email: u.email,
    nickName: u.nick_name,
    role: u.role,
    isDelete: u.isDelete,
    createdAt: u.created_at,
  }));

  return {
    users: SetUser,
    totalCount,
    currentPage: page,
    totalPage: Math.ceil(totalCount / limit),
  };
}

export async function findUserByEmailAdmin(email) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      email: true,
      nick_name: true,
      role: true,
      isDelete: true,
      created_at: true,
    },
  });
  return{
    email: user.email,
    nickName: user.nick_name,
    role: user.role,
    isDelete: user.isDelete,
    createdAt: user.created_at,
  } 
}

export async function changeUserRoleByEmail(email, role){
  const user = await prisma.user.update({
    where: { email },
    data: { role },
    select: {
      user_id: true,
      email: true,
      nick_name: true,
      role: true,
    },
  });
  return{
    userId: user.user_id,
    email: user.email,
    nickName: user.nick_name,
    role: user.role,
  } 
}
