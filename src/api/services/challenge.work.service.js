import * as workRepository from "../repositories/challenge.work.repository.js";
import { NotFoundError, UnauthorizedError, BadRequestError, ConflictError } from '../../utils/error.util.js';
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
    throw new BadRequestError(
      `챌린지 ID '${challenge_id}'의 작업물 목록 조회에 실패했습니다. 데이터베이스에서 올바른 형식의 데이터를 반환받지 못했습니다. 잠시 후 다시 시도하거나 관리자에게 문의해주세요.`,
      'WORK_LIST_FETCH_FAILED'
    );
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
      size: size,
      totalCount: total,
      totalPages: Math.ceil(total / size),
    },
  };
}


//상세
export async function getWorkDetail(req,attend_id){
  const { userId } = await getUserFromToken(req);
  const attend = await workRepository.findWorkById(attend_id);

  if(!attend){
    throw new NotFoundError(
      `작업물 ID '${attend_id}'를 찾을 수 없습니다. 작업물이 존재하지 않거나 이미 삭제되었을 수 있습니다. 작업물 ID를 확인해주세요.`,
      'WORK_NOT_FOUND'
    );
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
    throw new BadRequestError(
      `사용자 ID '${userId}'의 임시 저장 목록 조회에 실패했습니다. 데이터베이스에서 올바른 형식의 데이터를 반환받지 못했습니다. 잠시 후 다시 시도하거나 관리자에게 문의해주세요.`,
      'SAVE_LIST_FETCH_FAILED'
    );
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
      size: size,
      totalCount: total,
      totalPages: Math.ceil(total / size),
    },
  };
}


// 임시 저장 상세
export async function getSaveDetail(req, attend_id){
  const viewer = await getUserFromToken(req);

  const attend = await workRepository.findSaveById(attend_id);

  if (!attend)
    throw new NotFoundError(
      `임시 저장 ID '${attend_id}'를 찾을 수 없습니다. 임시 저장된 작업물이 존재하지 않거나 이미 삭제되었을 수 있습니다. 임시 저장 ID를 확인해주세요.`,
      'SAVE_NOT_FOUND'
    );

  if(viewer.userId !== attend.user_id)
    throw new UnauthorizedError(
      `임시 저장 ID '${attend_id}'에 대한 조회 권한이 없습니다. 본인이 작성한 임시 저장만 조회할 수 있습니다. 현재 사용자 ID: '${viewer.userId}', 작성자 ID: '${attend.user_id}'`,
      'SAVE_ACCESS_DENIED'
    );

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
    throw new BadRequestError(
      `챌린지 ID '${challenge_id}'는 이미 종료되었습니다. 종료된 챌린지에는 작업물을 제출할 수 없습니다. 진행 중인 다른 챌린지를 선택해주세요.`,
      'CHALLENGE_ALREADY_CLOSED'
    );
  }

  // 참여자 정원 초과 검증
  const currentParticipants = await workRepository.countWorksByChallengeId(challenge_id);
  const maxParticipants = parseInt(challenge.capacity);

  if (currentParticipants >= maxParticipants) {
    throw new BadRequestError(
      `챌린지 ID '${challenge_id}'의 참여 인원이 이미 정원(${maxParticipants}명)에 도달했습니다. 현재 참여자 수: ${currentParticipants}명. 다른 챌린지를 선택해주세요.`,
      'CHALLENGE_CAPACITY_FULL'
    );
  }

  const existinWork = await workRepository.findExistingWork(challenge_id, userId);

  if(existinWork){
    throw new ConflictError(
      `챌린지 ID '${challenge_id}'에 이미 제출된 작업물이 존재합니다. 하나의 챌린지에는 한 번만 작업물을 제출할 수 있습니다. 기존 작업물 ID: '${existinWork.attend_id}'`,
      'WORK_ALREADY_SUBMITTED'
    );
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
    throw new BadRequestError(
      `챌린지 ID '${challenge_id}'는 이미 종료되었습니다. 종료된 챌린지에는 작업물을 임시 저장할 수 없습니다. 진행 중인 다른 챌린지를 선택해주세요.`,
      'CHALLENGE_ALREADY_CLOSED'
    );
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
    throw new NotFoundError(
      `작업물 ID '${attend_id}'를 찾을 수 없습니다. 작업물이 존재하지 않거나 이미 삭제되었을 수 있습니다. 작업물 ID를 확인해주세요.`,
      'WORK_NOT_FOUND'
    );

  if(attend.user_id !== user.userId && user.role !== "ADMIN")
    throw new UnauthorizedError(
      `작업물 ID '${attend_id}'에 대한 수정 권한이 없습니다. 본인이 작성한 작업물만 수정할 수 있습니다. 현재 사용자 ID: '${user.userId}', 작성자 ID: '${attend.user_id}'`,
      'WORK_UPDATE_DENIED'
    );

  if(attend.challenge?.isClose)
    throw new BadRequestError(
      `챌린지 ID '${attend.challenge.challenge_id}'는 이미 종료되었습니다. 종료된 챌린지의 작업물은 수정할 수 없습니다.`,
      'CHALLENGE_ALREADY_CLOSED'
    );

  const updated = await workRepository.updateWorkById(attend_id, {
    title,
    work_item: workItem,
  });

  // 작업물 업데이트 알림 추가 (attend_id 포함)
  const userId = attend.user.user_id;
  await noticeServices.addAdminWorkUpdateNotice("업데이트", userId, attend.challenge.title, "", attend_id);
}

export async function deleteWork(req, attend_id, deleteReason){
  const user = await getUserFromToken(req);

  const attend = await workRepository.findWorkWithChallengeById(attend_id);

  if(!attend)
    throw new NotFoundError(
      `작업물 ID '${attend_id}'를 찾을 수 없습니다. 작업물이 존재하지 않거나 이미 삭제되었을 수 있습니다. 작업물 ID를 확인해주세요.`,
      'WORK_NOT_FOUND'
    );
  //오타 if(); <- ; 들어가서 삭제 불가능 판정
  if(attend.user_id !== user.userId && user.role !== "ADMIN")
    throw new UnauthorizedError(
      `작업물 ID '${attend_id}'에 대한 삭제 권한이 없습니다. 본인이 작성한 작업물만 삭제할 수 있습니다. 현재 사용자 ID: '${user.userId}', 작성자 ID: '${attend.user_id}'`,
      'WORK_DELETE_DENIED'
    );

  if(attend.challenge?.isClose){
    throw new BadRequestError(
      `챌린지 ID '${attend.challenge.challenge_id}'는 이미 종료되었습니다. 종료된 챌린지의 작업물은 삭제할 수 없습니다.`,
      'CHALLENGE_ALREADY_CLOSED'
    );
  }

  // 관련된 좋아요와 피드백 삭제
  await workRepository.deleteLikesByAttendId(attend_id);
  await workRepository.deleteFeedbacksByAttendId(attend_id);

  // Soft delete: is_delete를 true로 설정하고 삭제 이유 저장
  await workRepository.deleteWorkById(attend_id, deleteReason);

  // 작업물 삭제 알림 추가 (attend_id 포함)
  const userId = attend.user.user_id;
  await noticeServices.addAdminWorkUpdateNotice("삭제", userId, attend.challenge.title, deleteReason, attend_id);

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