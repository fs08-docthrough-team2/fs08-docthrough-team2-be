import prisma from "../../config/prisma.config.js";
import { getUserFromToken } from "./user.service.js";

// 전체 리스트 조회
export async function getFeedbackList({ attend_id, page=1, size=10}) {
  const skip = (page -1) * size;

  const total = await prisma.feedback.count({ where: { attend_id } });

  const items = await prisma.feedback.findMany({
    where: { attend_id },
    select:{
      feedback_id: true,
      content: true,
      created_at: true,
      updated_at: true,
      user:{
        select: {
          nick_name: true,
          role: true
        }
      },  
    },
    orderBy: { created_at: "desc" },
    skip,
    take: size,
  });
  return {
    items,
    pagination: {
      page,
      size,
      total,
      totalPage: Math.ceil(total/ size),
    }
  }
}

// 단일 조회
export async function getFeedbackDetail({ feedback_id }){
  const feedback = await prisma.feedback.findFirst({
    where: { feedback_id },
    select: {
      feedback_id: true,
      content: true, 
      created_at: true,
      updated_at: true,
      user:{
        select: {
          nick_name: true,
          role: true,
        },
      },
      attend: {
        select:{
          attend_id: true,
        }
      }
    },
  });
  
  if(!feedback) 
    throw new Error("피드백을 찾을 수 없습니다.");
  return { item: feedback }
}

//생성
export async function createFeedback(req, { attend_id, content}) {
  const { userId } = await getUserFromToken(req);

  const attend = await prisma.attend.findUnique({ where: { attend_id }});
  if(!attend)
    throw new Error("작업물을 찾을 수 없습니다.")

  const feedback = await prisma.feedback.create({
    data: {
      attend_id,
      user_id: userId,
      content,
    },
  });
  return { message: "피드백이 등록되었습니다.", feedbakc_id:feedback.feedback_id};
}

//수정
export async function updateFeedback(req, { feedback_id, content}){
  const { userId, role } = await getUserFromToken(req);

  const feedback = await prisma.feedback.findUnique({
    where: { feedback_id },
    select: { user_id: true },
  });

  if(!feedback)
    throw new Error("피드백을 찾을 수 없습니다.");

  if(feedback.user_id !== userId && role !== "ADMIN"){
    throw new Error("수정 권한이 없습니다.");
  }

  await prisma.feedback.update({
    where: { feedback_id },
    data:{
      content,
      updated_at: new Date(),
    },
  });

  return { message: "피드백이 수정되었습니다." };
}

//삭제
export async function deleteFeedback(req, { feedback_id }){
  const { userId, role } = await getUserFromToken(req);

  const feedback = await prisma.feedback.findUnique({
    where: { feedback_id },
    select: { user_id: true },
  });

  if(!feedback)
    throw new Error("피드백을 찾을 수 없습니다.");

  if(feedback.user_id !== userId && role !== "ADMIN"){
    throw new Error("수정 권한이 없습니다.");
  }

  await prisma.feedback.delete({ where: { feedback_id } });
  return { message: "피드백이 삭제되었습니다." };
}
