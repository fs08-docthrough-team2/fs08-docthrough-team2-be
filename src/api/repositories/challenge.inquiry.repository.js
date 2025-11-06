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
 * 챌린지 상세 조회
 */
export async function findChallengeDetailById(challengeId) {
  return prisma.challenge.findUnique({
    where: {
      challenge_id: challengeId,
    },
    select: {
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
          attends: true,
        },
      },
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
      isSave: true,
    },
    select: {
      attend_id: true,
      user_id: true,
      updated_at: true,
      user: {
        select: {
          nick_name: true,
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
 * 사용자 참여 챌린지 목록 조회
 */
export async function findUserChallenges({ where, skip, take, orderBy }) {
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
      _count: {
        select: {
          attends: true,
        }
      }
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
          attends: true,
        }
      }
    },
    skip,
    take,
    orderBy
  });
}

export default {
  countChallenges,
  findChallengesWithAttendCount,
  findChallengeDetailById,
  findParticipatesByChallenge,
  findUserChallenges,
  findUserChallengeDetails,
};
