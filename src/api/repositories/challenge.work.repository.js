import prisma from "../../config/prisma.config.js";

/**
 * 작업물 목록 조회 (챌린지별)
 */
export async function findWorksByChallengeId({ challengeId, skip, take }) {
  return prisma.attend.findMany({
    where: {
      challenge_id: challengeId,
      isSave: false,
      is_delete: false
    },
    select: {
      attend_id: true,
      created_at: true,
      user: {
        select: {
          nick_name: true,
          role: true,
        },
      },
      likes: {
        select: {
          liker: true,
        },
      },
    },
    orderBy: [{ created_at: "desc" }],
    skip,
    take,
  });
}

/**
 * 작업물 개수 조회
 */
export async function countWorksByChallengeId(challengeId) {
  return prisma.attend.count({
    where: {
      challenge_id: challengeId,
      isSave: false,
      is_delete: false
    },
  });
}

/**
 * 작업물 상세 조회
 */
export async function findWorkById(attendId) {
  return prisma.attend.findFirst({
    where: {
      attend_id: attendId,
      isSave: false,
      is_delete: false,
    },
    select: {
      attend_id: true,
      user_id: true,
      title: true,
      work_item: true,
      created_at: true,
      user: {
        select: {
          nick_name: true,
          role: true,
        },
      },
      likes: {
        select: {
          liker: true,
        },
      },
      challenge: {
        select: {
          isClose: true,
        },
      },
    },
  });
}

/**
 * 임시 저장 목록 조회
 */
export async function findSavesByUserId({ userId, skip, take }) {
  return prisma.attend.findMany({
    where: {
      user_id: userId,
      isSave: true,
      is_delete: false,
    },
    select: {
      attend_id: true,
      title: true,
      created_at: true,
      user: {
        select: {
          nick_name: true,
        },
      },
    },
    orderBy: [{ created_at: "desc" }],
    skip,
    take,
  });
}

/**
 * 임시 저장 개수 조회
 */
export async function countSavesByUserId(userId) {
  return prisma.attend.count({
    where: {
      user_id: userId,
      isSave: true,
      is_delete: false,
    },
  });
}

/**
 * 임시 저장 상세 조회
 */
export async function findSaveById(attendId) {
  return prisma.attend.findFirst({
    where: {
      attend_id: attendId,
      isSave: true,
      is_delete: false,
    },
    select: {
      attend_id: true,
      title: true,
      work_item: true,
      created_at: true,
      user_id: true,
      user: {
        select: {
          nick_name: true,
          role: true,
        },
      },
      challenge: {
        select: {
          isClose: true,
        },
      },
    },
  });
}

/**
 * 챌린지 조회 (isClose, capacity 확인용)
 */
export async function findChallengeIsClose(challengeId) {
  return prisma.challenge.findUnique({
    where: { challenge_id: challengeId },
    select: {
      isClose: true,
      title: true,
      capacity: true,
      _count: {
        select: {
          attends: true
        }
      }
    },
  });
}

/**
 * 기존 작업물 존재 확인
 */
export async function findExistingWork(challengeId, userId) {
  return prisma.attend.findFirst({
    where: {
      challenge_id: challengeId,
      user_id: userId,
      isSave: false,
      is_delete: false,
    },
  });
}

/**
 * 작업물 생성
 */
export async function createWork(data) {
  return prisma.attend.create({ data });
}

/**
 * 작업물 조회 (수정/삭제 권한 확인용)
 */
export async function findWorkWithChallengeById(attendId) {
  return prisma.attend.findFirst({
    where: {
      attend_id: attendId,
      is_delete: false
    },
    include: {
      challenge: {
        select: {
          isClose: true,
          challenge_id: true,
          title: true,
        },
      },
      user: {
        select: {
          user_id: true,
        },
      },
    },
  });
}

/**
 * 작업물 수정
 */
export async function updateWorkById(attendId, data) {
  return prisma.attend.update({
    where: { attend_id: attendId },
    data: {
      ...data,
      updated_at: new Date(),
    },
  }); 
}

/**
 * 작업물의 좋아요 모두 삭제
 */
export async function deleteLikesByAttendId(attendId) {
  return prisma.like.deleteMany({ where: { attend_id: attendId } });
}

/**
 * 작업물의 피드백 모두 삭제
 */
export async function deleteFeedbacksByAttendId(attendId) {
  return prisma.feedback.deleteMany({ where: { attend_id: attendId } });
}

/**
 * 작업물 삭제 (Soft Delete)
 */
export async function deleteWorkById(attendId, deleteReason) {
  return prisma.attend.update({
    where: { attend_id: attendId },
    data: {
      is_delete: true,
      delete_reason: deleteReason || null,
      updated_at: new Date(),
    },
  });
}

/**
 * 좋아요 존재 확인
 */
export async function findExistingLike(userId, attendId) {
  return prisma.like.findFirst({
    where: {
      user_id: userId,
      attend_id: attendId,
    },
  });
}

/**
 * 좋아요 삭제
 */
export async function deleteLikeById(likeId) {
  return prisma.like.delete({ where: { like_id: likeId } });
}

/**
 * 좋아요 추가
 */
export async function createLike(data) {
  return prisma.like.create({ data });
}

export default {
  findWorksByChallengeId,
  countWorksByChallengeId,
  findWorkById,
  findSavesByUserId,
  countSavesByUserId,
  findSaveById,
  findChallengeIsClose,
  findExistingWork,
  createWork,
  findWorkWithChallengeById,
  updateWorkById,
  deleteLikesByAttendId,
  deleteFeedbacksByAttendId,
  deleteWorkById,
  findExistingLike,
  deleteLikeById,
  createLike,
};
