import * as feedbackRepository from "../repositories/challenge.feedback.repository.js";
import { getUserFromToken } from "./user.service.js";
import noticeServices from './notice.service.js';

// 전체 리스트 조회
export async function getFeedbackList({ attend_id, page=1, size=10}) {
  const skip = (page -1) * size;

  const total = await feedbackRepository.countFeedbacks(attend_id);

  const items = await feedbackRepository.findFeedbacksByAttendId({
    attendId: attend_id,
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
  const feedback = await feedbackRepository.findFeedbackById(feedback_id);
  
  if(!feedback) 
    throw new Error("피드백을 찾을 수 없습니다.");
  return { item: feedback }
}

//생성
export async function createFeedback(req, { attend_id, content}) {
  const { userId } = await getUserFromToken(req);

  const attend = await feedbackRepository.findAttendWithChallengeById(attend_id);

  if(!attend)
    throw new Error("작업물을 찾을 수 없습니다.")

  const feedback = await feedbackRepository.createFeedback({
    attend_id,
    user_id: userId,
    content,
  });

  // 작업물 작성자에게 피드백 도착 알림 전송
  const challengeTitle = attend.challenge.title;
  const workAuthorId = attend.user_id;
  await noticeServices.addFeedbackReceiveNotice(workAuthorId, challengeTitle);

  return { message: "피드백이 등록되었습니다.", feedback_id:feedback.feedback_id};
}

//수정
export async function updateFeedback(req, { feedback_id, content}){
  const { userId, role } = await getUserFromToken(req);

  const feedback = await feedbackRepository.findFeedbackWithChallengeById(feedback_id);

  if(!feedback)
    throw new Error("피드백을 찾을 수 없습니다.");

  if(feedback.user_id !== userId && role !== "ADMIN"){
    throw new Error("수정 권한이 없습니다.");
  }

  await feedbackRepository.updateFeedbackById(feedback_id, content);

  // 알림 생성
  const challengeTitle = feedback.attend.challenge.title;
  await noticeServices.addModifyNotice("피드백", "수정", userId, challengeTitle);

  return { message: "피드백이 수정되었습니다." };
}

//삭제
export async function deleteFeedback(req, { feedback_id }){
  const { userId, role } = await getUserFromToken(req);

  const feedback = await feedbackRepository.findFeedbackWithChallengeById(feedback_id);

  if(!feedback)
    throw new Error("피드백을 찾을 수 없습니다.");

  if(feedback.user_id !== userId && role !== "ADMIN"){
    throw new Error("삭제 권한이 없습니다.");
  }

  // 챌린지 제목 저장 (삭제 전에)
  const challengeTitle = feedback.attend.challenge.title;

  await feedbackRepository.deleteFeedbackById(feedback_id);

  // 알림 생성
  await noticeServices.addModifyNotice("피드백", "삭제", userId, challengeTitle);

  return { message: "피드백이 삭제되었습니다." };
}
