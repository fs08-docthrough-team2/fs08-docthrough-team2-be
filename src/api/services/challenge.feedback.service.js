import * as feedbackRepository from "../repositories/challenge.feedback.repository.js";
import { getUserFromToken } from "./user.service.js";
import noticeServices from './notice.service.js';

// 전체 리스트 조회
export async function getFeedbackList({ attendId, page=1, size=10}) {
  const skip = (page -1) * size;

  const total = await feedbackRepository.countFeedbacks(attendId);

  const items = await feedbackRepository.findFeedbacksByAttendId({
    attendId,
    skip,
    take: size,
  });

  const setFeedback = items.map((item) => ({
    feedbackId: item.feedback_id,
    content: item.content,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    user:{
      nickName: item.user?.nick_name,
      role: item.user?.role,
    }
  }));

  return {
    items: setFeedback,
    pagination: {
      page,
      size,
      total,
      totalPage: Math.ceil(total/ size),
    }
  }
}

// 단일 조회
export async function getFeedbackDetail({ feedbackId  }){
  const feedback = await feedbackRepository.findFeedbackById(feedbackId );
  
  if(!feedback) 
    throw new Error("피드백을 찾을 수 없습니다.");
  
  return { 
  item: {
    feedbackId: feedback.feedback_id,
    content: feedback.content,
    createdAt: feedback.created_at,
    updatedAt: feedback.updated_at,
    user:{
      nickName: feedback.user?.nick_name,
      role: feedback.user?.role,
    },
    attend:{
      attendId: feedback.attend?.attend_id,
    }
  }
}
}

//생성
export async function createFeedback(req, { attendId, content }) {
  const { userId } = await getUserFromToken(req);

  const attend = await feedbackRepository.findAttendWithChallengeById(attendId);

  if(!attend)
    throw new Error("작업물을 찾을 수 없습니다.")

  const feedback = await feedbackRepository.createFeedback({
    attend_id: attendId,
    user_id: userId,
    content,
  });

  // 작업물 작성자에게 피드백 도착 알림 전송
  const challengeTitle = attend.challenge.title;
  const workAuthorId = attend.user_id;
  await noticeServices.addFeedbackReceiveNotice(workAuthorId, challengeTitle);

  return { 
    message: "피드백이 등록되었습니다.",
    feedback: {
      feedbackId: feedback.feedback_id,
      content: feedback.content,
      createdAt: feedback.created_at,
      updatedAt: feedback.updated_at,
    },
  };
}

export async function updateFeedback(req, { feedbackId, content}){
  const { userId, role } = await getUserFromToken(req);

  const feedback = await feedbackRepository.findFeedbackWithChallengeById(feedbackId);

  if(!feedback)
    throw new Error("피드백을 찾을 수 없습니다.");

  if(feedback.user_id !== userId && role !== "ADMIN"){
    throw new Error("수정 권한이 없습니다.");
  }

  const items = await feedbackRepository.updateFeedbackById(feedbackId, content);

  // 알림 생성
  const challengeTitle = feedback.attend.challenge.title;
  await noticeServices.addModifyNotice("피드백", "수정", userId, challengeTitle);

  return { 
    message: "피드백이 수정되었습니다.",
    feedback: {
      feedbackId: items.feedback_id,
      content: items.content,
      updatedAt: items.updated_at,
    }
  };
}

//삭제
export async function deleteFeedback(req, { feedbackId }){
  const { userId, role } = await getUserFromToken(req);

  const feedback = await feedbackRepository.findFeedbackWithChallengeById(feedbackId);

  if(!feedback)
    throw new Error("피드백을 찾을 수 없습니다.");

  if(feedback.user_id !== userId && role !== "ADMIN"){
    throw new Error("삭제 권한이 없습니다.");
  }

  // 챌린지 제목 저장 (삭제 전에)
  const challengeTitle = feedback.attend.challenge.title;

  const items = await feedbackRepository.deleteFeedbackById(feedbackId);

  // 알림 생성
  await noticeServices.addModifyNotice("피드백", "삭제", userId, challengeTitle);

  return { 
    message: "피드백이 삭제되었습니다.", 
    feedback: {
      feedbackId: items.feedback_id,
      content: items.content,
      createdAt: items.created_at,
    }, 
  };
}