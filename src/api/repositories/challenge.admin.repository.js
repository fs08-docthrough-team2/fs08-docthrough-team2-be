import prisma from "../../config/prisma.config.js";

/**
 * 챌린지 개수 조회
 */
export async function countChallenges(whereCondition) {
  return prisma.challenge.count({ where: whereCondition });
}

/**
 * 챌린지 목록 조회 (Admin용)
 */
export async function findChallengesForAdmin({ where, skip, take, orderBy }) {
  return prisma.challenge.findMany({
    select: {
      challenge_no: true,
      challenge_id: true,
      title: true,
      type: true,
      field: true,
      status: true,
      deadline: true,
      created_at: true,
      capacity: true,
      _count: {
        select: {
          attends: true,
        },
      },
    },
    where,
    skip,
    take,
    orderBy,
  });
}

/**
 * ID로 챌린지 상세 조회
 */
export async function findChallengeById(challengeId) {
  return prisma.challenge.findUnique({
    where: { challenge_id: challengeId },
  });
}

/**
 * 챌린지 승인
 */
export async function approveChallengeById(challengeId) {
  return prisma.challenge.update({
    where: { challenge_id: challengeId },
    data: {
      isApprove: true,
      isReject: false,
      reject_content: null,
      status: 'APPROVED'
    },
  });
}

/**
 * 챌린지 거절
 */
export async function rejectChallengeById(challengeId, rejectComment) {
  return prisma.challenge.update({
    where: { challenge_id: challengeId },
    data: {
      isReject: true,
      isApprove: false,
      reject_content: rejectComment,
      status: 'REJECTED',
    },
  });
}

export async function updateChallengeAdminId(challengeId, adminId) {
  return prisma.challenge.update({
    where: { challenge_id: challengeId },
    data: {
      admin_id: adminId,
    },
  });
}

export default {
  countChallenges,
  findChallengesForAdmin,
  findChallengeById,
  approveChallengeById,
  rejectChallengeById,
  updateChallengeAdminId,
};
