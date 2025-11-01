import prisma from "../../common/prisma.js";
import dotenv from "dotenv"

import { getUserFromToken } from "./user.service.js";



//리스트
export async function getWorkList({ challenge_id, page = 1, size = 10 }){
  const skip = (page - 1) * size;

  const attends = await prisma.attend.findMany({
    where: { challenge_id, isSave: false },
    select: {
      attend_id: true,
      created_at: true,
      user: {
        select: {
          nick_name: true, 
          role: true,
        },
      },
      likes: {
        select: {
          liker: true
        },
      },
    },
    orderBy: [{ created_at:"desc" }],
    skip,
    take: size,
  });

  const rows = attends.map((a)=> ({
    attendsId: a.attend_id,
    nickName: a.user.nick_name,
    role: a.user.role,
    likeCount: a.likes.filter((l) => l.liker).length,
    createdAt: a.created_at,
  }));

  rows.sort((a, b) => b.likeCount - a.likeCount || b.createdAt - a.createdAt);

  const total = await prisma.attend.count({ 
    where: { challenge_id, isSave: false },
  });

  return {
    items: rows.slice(skip, skip + size),
    pagination: {
      page,
      size,
      total,
      totalPages: Math.ceil(total / size),
    },
  };
}


//상세
export async function getWorkDetail(attend_id){
  const attend = await prisma. attend.findUnique({
    where: { 
      attend_id , 
      isSave: false
    },
    select:  {
      attend_id: true,
      title: true,
      work_item: true,
      created_at: true,
      user: {
        select: {
          nick_name: true,
          role: true
        },
      },
      likes: {
        select: {
          liker: true
        },
      },
      challenge: {
        select: { 
          isClose: true
        },
      },
    },
  });

  if(!attend){
    throw new Error("작업물을 찾을 수 없습니다.");
  }
  const likeCount = attend.likes.filter((l) => l.liker).length;

  return {
    item:{
      attendId: attend.attend_id,
      title: attend.title,
      workItem: attend.work_item,
      createdAt: attend.created_at,
      nickName: attend.user.nick_name,
      role: attend.user.role,
      likeCount, 
      isClose: attend.challenge.isClose,
    },
  };
}


//게시글 임시 저장용
export async function getSaveList(req, { page = 1, size = 5 }){
  const { userId } = await getUserFromToken(req);
  const skip = (page - 1) * size;

  const total = await prisma.attend.count({
    where: { 
      user_id: userId, 
      isSave: true
    }
  });

  const attends = await prisma.attend.findMany({
    where: {
      user_id: userId,
      isSave: true,
    },
    select:{
      attend_id: true,
      title:true,
      created_at: true,
      user:{
        select:{
          nick_name:true
        },
      },
    },
    orderBy: [{ created_at: "desc" }],
    skip,
    take: size,
  });

  const rows = attends.map((a) => ({
    attendId: a.attend_id,
    title: a.title,
    createdAt: a.created_at,
    nickName: a.user.nick_name, 
  }));

  return {
    items: rows.slice(skip, skip + size),
    pagination:{
      page,
      size,
      total,
      totalPages: Math.ceil(total / size),
    },
  };
}


// 임시 저장 상세
export async function getSaveDetail(req, attend_id){
  const viewer = await getUserFromToken(req);

  const attend = await prisma.attend.findUnique({
    where: {
      attend_id,
      isSave:true
    },
    select: {
      attend_id: true,
      title: true,
      work_item: true,
      created_at: true,
      user_id: true,
      user:{
        select: {
          nick_name: true,
          role: true
        },
      },
      challenge: {
        select: {
          isClose: true
        }
      },
    },
  });

  if (!attend)
    throw new Error("임시 저장된 작업물을 찾을 수 없습니다.");

  if(viewer.userId !== attend.user_id)
    throw new Error("본인의 임시 저장만 조회 가능합니다.");

  return{
    item:{
      attendId: attend.attend_id,
      title: attend.title,
      workItem: attend.work_item,
      createdAt: attend.created_at,
      nickName: attend.user.nick_name,
      role: attend.user.role,
      isClose: attend.challenge.isClose,
    },
  };
}

// 생성
export async function createWork(req, { challenge_id, title, workItem }){
  const { userId } = await getUserFromToken(req);

  const challenge = await prisma.challenge.findUnique({
    where: { challenge_id },
    select: {
      isClose: true
    },
  });

  if(challenge?.isClose){
    const err = new Error("이미 종료된 첼린지 입니다.");
    err.status = 403;
    throw err;
  }

  const existinWork =  await prisma.attend.findFirst({
    where:{
      challenge_id,
      user_id: userId,
      isSave: false,
    },
  });

  if(existinWork){
    const err = new Error("이미 제출된 작업물이 존재합니다.");
  }
  
  const attend = await prisma.attend.create({
    data:{
      challenge_id,
      user_id: userId,
      title,
      work_item: workItem,
      isSave: false,
    },
  });
  return {
    message: "작업물 제출",
    attendId: attend.attend_id
  };
}

// 임시 저장 생성
export async function createSaveWork(req, { challenge_id, title, workItem}){
  const { userId } = await getUserFromToken(req);
  
  const challenge = await prisma.challenge.findUnique({
    where:{
      challenge_id
    },
    select: {
      isClose: true
    },
  });

  if(challenge?.isClose){
    throw new Error("이미 종료된 첼린지 입니다.");
  }

  const attend = await prisma.attend.create({
    data:{
      challenge_id,
      user_id: userId,
      title,
      work_item: workItem,
      isSave: true,
    },
  });
  return{
    message: "임시 저장 완료",
    attendId: attend.attend_id
  };
}

// 수정
export async function updateWork(req, attend_id, { title, workItem }){
  const user = await getUserFromToken(req);

  const attend = await prisma.attend.findUnique({
    where: { attend_id },
    include: {
      challenge:{
        select:{
          isClose: true
        },
      },
      user:{ 
        select:{
          user_id: true,
        },
      },
    },
  });

  if(!attend) 
    throw new Error("작업물을 찾을 수 없습니다.");

  if(attend.user_id !== user.userId && user.role !== "ADMIN")
    throw new Error("본인만 수정할 수 있습니다.");

  if(attend.challenge?.isClose)
    throw new Error("이미 종료된 첼린지");
  const updated = await prisma.attend.update({
    where: {
      attend_id
    },
    data:{
      title,
      work_item: workItem,
      updated_at: new Date()
    },
  });
}

export async function deleteWork(req, attend_id){
  const user = await getUserFromToken(req);

  const attend = await prisma.attend.findUnique({
    where: { attend_id },
    include: { 
      challenge: {
        select: {
          isClose:true
        },
      },
      user: {
        select: {
          user_id:true
        },
      },
    },
  });

  if(!attend)
    throw new Error("작업물을 찾을 수 없습니다.");

  if(attend.user_id !== user.userId && user.role !== "ADMIN");
    throw new Error("본인만 삭제할 수 있습니다.");

  if(attend.challenge?.isClose){
    throw new Error("이미 종료된 첼린지입니다.");
  }

  await prisma.attend.delete({ where: { attend_id }});
  return { message: "삭제 완료 "};
}

export async function toggleLike(req, attend_id) {
  const { userId } = await getUserFromToken(req);

  const exisitg = await prisma.like.findFirst({
    where:{
      user_id: userId,
      attend_id
    },
  });

  if(exisitg){
    await prisma.like.delete({ where: { like_id: exisitg.like_id } });
    return { message: "좋아요 취소" };
  }
  else{
    await prisma.like.create({
      data:{
        user_id: userId,
        attend_id,
        liker:true,
      },
    });
    return{ message: "좋아요 추가" }
  }

}