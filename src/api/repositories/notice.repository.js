import prisma from "../../config/prisma.config.js";

/**
 * 알림 생성
 */
export async function createNotice(data) {
  return prisma.notice.create({ data });
}

/**
 * ID로 알림 찾기
 */
export async function findNoticeById(noticeId) {
  return prisma.notice.findUnique({
    where: { notice_id: noticeId },
    select: { isRead: true },
  });
}

/**
 * 알림 읽음 상태 업데이트
 */
export async function updateNoticeAsRead(noticeId) {
  return prisma.notice.update({
    where: { notice_id: noticeId },
    data: { isRead: true },
  });
}

/**
 * 사용자 알림 개수 조회
 */
export async function countUserNotices(userId) {
  return prisma.notice.count({
    where: { user_id: userId },
  });
}

/**
 * 사용자 알림 목록 조회 (페이지네이션)
 */
export async function findUserNotices(userId) {
  return prisma.notice.findMany({
    where: { user_id: userId },
    include: {
      attend: {
        select: {
          attend_id: true,
          delete_reason: true,
          is_delete: true,
          title: true,
        }
      }
    },
    orderBy: { created_at: 'desc' },
  });
}

export default {
  createNotice,
  findNoticeById,
  updateNoticeAsRead,
  countUserNotices,
  findUserNotices,
};
