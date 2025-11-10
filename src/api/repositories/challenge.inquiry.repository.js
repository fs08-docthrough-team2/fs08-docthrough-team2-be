import prisma from "../../config/prisma.config.js";

/**
 * 챌린지 개수 조회
 */
export async function countChallenges(whereCondition) {
  return prisma.challenge.count({
    where: whereCondition,
  });
}

/**
 * 챌린지 목록 조회 (참여자 수 포함)
 */
export async function findChallengesWithAttendCount({ where, skip, take, orderBy }) {
  return prisma.challenge.findMany({
    select: {
      challenge_id: true,
      title: true,
      field: true,
      type: true,
      status: true,
      created_at: true,
      deadline: true,
      capacity: true,
      _count: {
        select: {
          attends: {
            where: {
              isSave: false,
              is_delete: false,
            },
          },
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
 * 챌린지 상세 조회
 */
export async function findChallengeDetailById(challengeId) {
  return prisma.challenge.findUnique({
    where: {
      challenge_id: challengeId,
    },
    select: {
      user_id: true,
      challenge_id: true,
      title: true,
      content: true,
      field: true,
      type: true,
      status: true,
      deadline: true,
      capacity: true,
      source: true,
      _count: {
        select: {
          attends: {
            where: {
              isSave: false,
              is_delete: false,
            },
          },
        },
      },
    },
  });
}

/**
 * 챌린지 참여자 수 조회
 */
export async function countParticipatesByChallenge(challengeId) {
  return prisma.attend.count({
    where: {
      challenge_id: challengeId,
      isSave: false,
      is_delete: false,
    },
  });
}

/**
 * 챌린지 참여자 목록 조회 (좋아요 수 포함)
 */
export async function findParticipatesByChallenge({ challengeId, skip, take }) {
  return prisma.attend.findMany({
    where: {
      challenge_id: challengeId,
      isSave: false,
      is_delete: false,
    },
    select: {
      attend_id: true,
      user_id: true,
      updated_at: true,
      user: {
        select: {
          nick_name: true,
          role: true,
        },
      },
      _count: {
        select: {
          likes: {
            where: {
              liker: true,
            },
          },
        },
      },
    },
    orderBy: [{ likes: { _count: 'desc' } }],
    skip,
    take,
  });
}

/**
 * 사용자 참여 챌린지 개수 조회
 */
export async function countUserChallenges({ userId, where }) {
  return prisma.challenge.count({
    where: {
      ...where,
      attends: {
        some: {
          user_id: userId,
          isSave: false,  // 임시 저장이 아닌 제출한 작업물만
          is_delete: false,
        }
      }
    },
  });
}

/**
 * 사용자 참여 챌린지 목록 조회
 */
export async function findUserChallenges({ userId, where, skip, take, orderBy }) {
  return prisma.challenge.findMany({
    where: {
      ...where,
      attends: {
        some: {
          user_id: userId,
          isSave: false,  // 임시 저장이 아닌 제출한 작업물만
          is_delete: false,
        }
      }
    },
    select: {
      challenge_id: true,
      title: true,
      content: true,
      type: true,
      status: true,
      field: true,
      source: true,
      deadline: true,
      capacity: true,
      _count: {
        select: {
          attends: {
            where: {
              isSave: false,
              is_delete: false,
            },
          },
        },
      },
      created_at: true,
    },
    skip,
    take,
    orderBy,
  });
}

/**
 * 사용자 신청 챌린지 상세 목록 조회 (거절 정보 포함)
 */
export async function findUserChallengeDetails({ where, skip, take, orderBy }) {
  return prisma.challenge.findMany({
    where,
    select: {
      challenge_id: true,
      title: true,
      content: true,
      type: true,
      status: true,
      field: true,
      source: true,
      deadline: true,
      capacity: true,
      isReject: true,
      reject_content: true,
      _count: {
        select: {
          attends: {
            where: {
              isSave: false,
              is_delete: false,
            },
          },
        },
      },
      created_at: true,
    },
    skip,
    take,
    orderBy
  });
}

export async function findChallengeStatusById(challengeId) {
  return prisma.challenge.findUnique({
    where: {
      challenge_id: challengeId,
    },
    select: {
      isDelete: true,
      delete_reason: true,
      isApprove: true,
      adminId: true,
      isReject: true,
      reject_content: true,
      updated_at: true,
    }
  });
}

export default {
  countChallenges,
  findChallengesWithAttendCount,
  findChallengeDetailById,
  countParticipatesByChallenge,
  findParticipatesByChallenge,
  countUserChallenges,
  findUserChallenges,
  findUserChallengeDetails,
  findChallengeStatusById,
};
