import * as workRepository from "../repositories/challenge.work.repository.js";

import { getUserFromToken } from "./user.service.js";
import noticeServices from './notice.service.js';



//리스트
export async function getWorkList({ challenge_id, page = 1, size = 10 }){
  const skip = (page - 1) * size;

  const attends = await workRepository.findWorksByChallengeId({
    challengeId: challenge_id,
    skip,
    take: size,
  });

  // attends가 배열인지 확인
  if (!Array.isArray(attends)) {
    throw new Error("작업물 목록 조회에 실패했습니다.");
  }

  const rows = attends.map((a)=> ({
    attendsId: a.attend_id,
    nickName: a.user.nick_name,
    role: a.user.role,
    likeCount: a.likes.filter((l) => l.liker).length,
    createdAt: a.created_at,
  }));

  rows.sort((a, b) => b.likeCount - a.likeCount || b.createdAt - a.createdAt);

  const total = await workRepository.countWorksByChallengeId(challenge_id);

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
export async function getWorkDetail(req,attend_id){
  const { userId } = await getUserFromToken(req);
  const attend = await workRepository.findWorkById(attend_id);

  if(!attend){
    throw new Error("작업물을 찾을 수 없습니다.");
  }
  const likeCount = attend.likes.filter((l) => l.liker).length;

  const checkLike = await workRepository.findExistingLike(userId, attend_id)
  const likeByMe = !!checkLike

  return {
    item:{
      attendId: attend.attend_id,
      userId: attend.user_id,
      title: attend.title,
      workItem: attend.work_item,
      createdAt: attend.created_at,
      nickName: attend.user.nick_name,
      role: attend.user.role,
      likeCount, 
      likeByMe,
      isClose: attend.challenge.isClose,
    },
  };
}


//게시글 임시 저장용
export async function getSaveList(req, { page = 1, size = 5 }){
  const { userId } = await getUserFromToken(req);
  const skip = (page - 1) * size;

  const total = await workRepository.countSavesByUserId(userId);

  const attends = await workRepository.findSavesByUserId({
    userId,
    skip,
    take: size,
  });

  // attends가 배열인지 확인
  if (!Array.isArray(attends)) {
    throw new Error("임시 저장 목록 조회에 실패했습니다.");
  }

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

  const attend = await workRepository.findSaveById(attend_id);

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
export async function createWork(req, challenge_id, title, workItem){
  const { userId } = await getUserFromToken(req);

  const challenge = await workRepository.findChallengeIsClose(challenge_id);

  if(challenge?.isClose){
    const err = new Error("이미 종료된 첼린지 입니다.");
    err.status = 403;
    throw err;
  }

  const existinWork = await workRepository.findExistingWork(challenge_id, userId);

  if(existinWork){
    const err = new Error("이미 제출된 작업물이 존재합니다.");
    err.status = 400;
    throw err;
  }

  const setTitle = title && title.trim() != "" ? title: `${userId}입니다.`

  const attend = await workRepository.createWork({
    challenge_id,
    title: setTitle,
    user_id: userId,
    work_item: workItem,
    isSave: false,
  });

  // 작업물 제출 알림 추가
  await noticeServices.addWorkSubmitNotice(userId, challenge.title);

  return {
    message: "작업물 제출",
    attendId: attend.attend_id
  };
}

// 임시 저장 생성
export async function createSaveWork(req, challenge_id, title, workItem){
  const { userId } = await getUserFromToken(req);

  const challenge = await workRepository.findChallengeIsClose(challenge_id);

  if(challenge?.isClose){
    throw new Error("이미 종료된 첼린지 입니다.");
  }
  const setTitle = title && title.trim() != "" ? title: `${userId}입니다.`

  const attend = await workRepository.createWork({
    challenge_id,
    user_id: userId,
    title: setTitle,
    work_item: workItem,
    isSave: true,
  });

  await noticeServices.addModifyNotice("작업물", "임시 저장", userId, challenge.title);

  return{
    message: "임시 저장 완료",
    attendId: attend.attend_id
  };
}

// 수정
export async function updateWork(req, attend_id, { title, workItem }){
  const user = await getUserFromToken(req);

  const attend = await workRepository.findWorkWithChallengeById(attend_id);

  if(!attend)
    throw new Error("작업물을 찾을 수 없습니다.");

  if(attend.user_id !== user.userId && user.role !== "ADMIN")
    throw new Error("본인만 수정할 수 있습니다.");

  if(attend.challenge?.isClose)
    throw new Error("이미 종료된 첼린지");

  const updated = await workRepository.updateWorkById(attend_id, {
    title,
    work_item: workItem,
  });

  // 작업물 업데이트 알림 추가
  const userId = attend.user.user_id;
  await noticeServices.addModifyNotice("작업물", "업데이트", userId, attend.challenge.title);
}

export async function deleteWork(req, attend_id){
  const user = await getUserFromToken(req);

  const attend = await workRepository.findWorkWithChallengeById(attend_id);

  if(!attend)
    throw new Error("작업물을 찾을 수 없습니다.");
  //오타 if(); <- ; 들어가서 삭제 불가능 판정
  if(attend.user_id !== user.userId && user.role !== "ADMIN")
    throw new Error("본인만 삭제할 수 있습니다.");

  if(attend.challenge?.isClose){
    throw new Error("이미 종료된 첼린지입니다.");
  }

  await workRepository.deleteLikesByAttendId(attend_id);
  await workRepository.deleteFeedbacksByAttendId(attend_id);
  await workRepository.deleteWorkById(attend_id);

  // 작업물 삭제 알림 추가
  const userId = attend.user.user_id;
  await noticeServices.addModifyNotice("작업물", "삭제", userId, attend.challenge.title);

  // 삭제 완료 메시지 반환
  return { message: "삭제 완료 "};
}

export async function toggleLike(req, attend_id) {
  const { userId } = await getUserFromToken(req);

  const exisitg = await workRepository.findExistingLike(userId, attend_id);

  if(exisitg){
    await workRepository.deleteLikeById(exisitg.like_id);
    return { message: "좋아요 취소" };
  }
  else{
    await workRepository.createLike({
      user_id: userId,
      attend_id,
      liker: true,
    });
    return{ message: "좋아요 추가" }
  }
}