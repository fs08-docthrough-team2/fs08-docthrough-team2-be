import prisma from "../../config/prisma.config.js";

/**
 * 피드백 개수 조회
 */
export async function countFeedbacks(attendId) {
  return prisma.feedback.count({ where: { attend_id: attendId } });
}

/**
 * 피드백 목록 조회
 */
export async function findFeedbacksByAttendId({ attendId, skip, take }) {
  return prisma.feedback.findMany({
    where: { attend_id: attendId },
    select: {
      feedback_id: true,
      content: true,
      created_at: true,
      updated_at: true,
      user: {
        select: {
          nick_name: true,
          role: true,
        },
      },
    },
    orderBy: { created_at: "desc" },
    skip,
    take,
  });
}

/**
 * ID로 피드백 상세 조회
 */
export async function findFeedbackById(feedbackId) {
  return prisma.feedback.findFirst({
    where: { feedback_id: feedbackId },
    select: {
      feedback_id: true,
      content: true,
      created_at: true,
      updated_at: true,
      user: {
        select: {
          nick_name: true,
          role: true,
        },
      },
      attend: {
        select: {
          attend_id: true,
        },
      },
    },
  });
}

/**
 * ID로 피드백 조회 (권한 확인용 - attend, challenge 포함)
 */
export async function findFeedbackWithChallengeById(feedbackId) {
  return prisma.feedback.findUnique({
    where: { feedback_id: feedbackId },
    select: {
      user_id: true,
      attend: {
        select: {
          challenge: {
            select: {
              title: true,
            },
          },
        },
      },
    },
  });
}

/**
 * attend 조회 (challenge 포함)
 */
export async function findAttendWithChallengeById(attendId) {
  return prisma.attend.findUnique({
    where: { attend_id: attendId },
    select: {
      attend_id: true,
      user_id: true,
      challenge: {
        select: {
          title: true,
        },
      },
    },
  });
}

/**
 * 피드백 생성
 */
export async function createFeedback(data) {
  return prisma.feedback.create({ data });
}

/**
 * 피드백 수정
 */
export async function updateFeedbackById(feedbackId, content) {
  return prisma.feedback.update({
    where: { feedback_id: feedbackId },
    data: {
      content,
      updated_at: new Date(),
    },
  });
}

/**
 * 피드백 삭제
 */
export async function deleteFeedbackById(feedbackId) {
  return prisma.feedback.delete({ where: { feedback_id: feedbackId } });
}

export default {
  countFeedbacks,
  findFeedbacksByAttendId,
  findFeedbackById,
  findFeedbackWithChallengeById,
  findAttendWithChallengeById,
  createFeedback,
  updateFeedbackById,
  deleteFeedbackById,
};
