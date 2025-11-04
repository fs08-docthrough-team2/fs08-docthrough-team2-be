// 챌린지에 변경 사항이 수정되거나 삭제되었을 때 전송되는 알림
import prisma from '../../config/prisma.config.js';

// 알림 타입을 지정하는 상수 선언
const TYPE_CHALLENGE = 'CHALLENGE';
const TYPE_WORK = 'ATTEND';
const TYPE_FEEDBACK = 'FEEDBACK';
const TYPE_ADMIN = 'APPROVAL';
const CURRENT_DATE = () => new Date().toISOString().split('T')[0];

async function addModifyNotice(type = undefined, mode = undefined, userID, challengeTitle) {
  // 알림 생성 후, 데이터베이스에 저장
  let noticeType;
  switch (type) {
    case '챌린지':
      noticeType = TYPE_CHALLENGE;
      break;
    case '작업물':
      noticeType = TYPE_WORK;
      break;
    case '피드백':
      noticeType = TYPE_FEEDBACK;
      break;
    default:
      noticeType = 'UNKNOWN';
      break;
  }

  await prisma.notice.create({
    data: {
      user_id: userID,
      type: noticeType,
      content:
        type +
        '(이)가 ' +
        mode +
        '되었습니다.' +
        ' 챌린지 제목: ' +
        challengeTitle +
        ', 변경일: ' +
        CURRENT_DATE(),
      isRead: false,
    },
  });

  return null;
}

// 챌린지의 상태가 변경되었을 때 전송되는 알림
async function addChallengeStateNotice(state = undefined, userID, challengeTitle) {
  // 알림 생성 후, 데이터베이스에 저장
  await prisma.notice.create({
    data: {
      user_id: userID,
      type: 'CHALLENGE',
      content:
        '챌린지가 ' +
        state +
        '되었습니다.' +
        ' 챌린지 제목: ' +
        challengeTitle +
        ', 변경일: ' +
        CURRENT_DATE(),
      isRead: false,
    },
  });

  return null;
}

// 챌린지에 새로운 작업물이 추가되었을 때 전송되는 알림
async function addWorkSubmitNotice(userID, challengeTitle) {
  // 알림 생성 후, 데이터베이스에 저장
  await prisma.notice.create({
    data: {
      user_id: userID,
      type: TYPE_WORK,
      content:
        '새로운 작업물이 제출되었습니다. 챌린지 제목: ' +
        challengeTitle +
        ', 추가일: ' +
        CURRENT_DATE(),
      isRead: false,
    },
  });

  return null;
}

// 챌린지에 새로운 피드백이 전송되었을 때 전송되는 알림
async function addFeedbackReceiveNotice(userID, challengeTitle) {
  // 알림 생성 후, 데이터베이스에 저장
  await prisma.notice.create({
    data: {
      user_id: userID,
      type: TYPE_FEEDBACK,
      content:
        '새로운 피드백이 도착했습니다. 챌린지 제목: ' +
        challengeTitle +
        ', 추가일: ' +
        CURRENT_DATE(),
      isRead: false,
    },
  });

  return null;
}

// 챌린지가 마감되었을 때 마감 날짜와 함께 전송되는 알림
async function addChallengeDeadlineNotice(userID, challengeTitle) {
  // 알림 생성 후, 데이터베이스에 저장
  await prisma.notice.create({
    data: {
      user_id: userID,
      type: TYPE_CHALLENGE,
      content:
        '챌린지 마감일이 다가왔습니다. 챌린지 제목: ' +
        challengeTitle +
        ', 마감일: ' +
        CURRENT_DATE(),
      isRead: false,
    },
  });

  return null;
}

// 알림을 읽었을 때 상태를 업데이트하는 함수
async function addMarkNoticeAsRead(noticeId, res) {
  const notice = await prisma.notice.findUnique({
    where: { notice_id: noticeId },
    select: { isRead: true },
  });

  if (notice?.isRead) {
    return res.status(400).json({ message: '이미 읽음 상태인 알림입니다.' });
  }
  // 알림 읽음 상태 업데이트 로직
  await prisma.notice.update({
    where: { notice_id: noticeId },
    data: { isRead: true },
  });

  return res.status(200).json({ message: '알림이 읽음 상태로 업데이트되었습니다.' });
}

// 어드민이 챌린지를 수정/삭제했을 때 신청자에게 사유가 전송되는 알림
async function addAdminChallengeUpdateNotice(mode = undefined, userID, challengeTitle, reason) {
  await prisma.notice.create({
    data: {
      user_id: userID,
      type: TYPE_ADMIN,
      content:
        '어드민이 챌린지를 ' +
        mode +
        '했습니다. 제목: ' +
        challengeTitle +
        ', 사유: ' +
        reason +
        ', 변경일: ' +
        CURRENT_DATE(),
      isRead: false,
    },
  });

  return null;
}

// 어드민이 피드백을 수정/삭제했을 때, 작성자에게 사유가 전송되는 알림
async function addAdminFeedbackUpdateNotice(mode = undefined, userID, challengeTitle, reason) {
  await prisma.notice.create({
    data: {
      user_id: userID,
      type: TYPE_ADMIN,
      content:
        '어드민이 피드백을 ' +
        mode +
        '했습니다. 제목: ' +
        challengeTitle +
        ', 사유: ' +
        reason +
        ', 변경일: ' +
        CURRENT_DATE(),
      isRead: false,
    },
  });

  return null;
}

// 알림 조회 함수
async function getUserNotice(userID, page, pageSize) {
  const skip = (page - 1) * pageSize;

  const totalCount = await prisma.notice.count({
    where: {
      user_id: userID,
    },
  });

  const notices = await prisma.notice.findMany({
    where: {
      user_id: userID,
    },
    orderBy: {
      created_at: 'desc',
    },
    skip: skip,
    take: pageSize,
  });

  return {
    success: true,
    data: notices,
    pagination: {
      page: page,
      pageSize: pageSize,
      totalCount: totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    },
  };
}

export default {
  addModifyNotice,
  addChallengeStateNotice,
  addWorkSubmitNotice,
  addFeedbackReceiveNotice,
  addChallengeDeadlineNotice,
  addMarkNoticeAsRead,
  addAdminChallengeUpdateNotice,
  addAdminFeedbackUpdateNotice,
  getUserNotice,
};
