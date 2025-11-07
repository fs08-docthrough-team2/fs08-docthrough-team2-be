import prisma from "../../config/prisma.config.js";

/**
 * 챌린지 생성
 */
export async function createChallenge(data) {
  return prisma.challenge.create({ data });
}

/**
 * 챌린지 업데이트
 */
export async function updateChallengeById(challengeId, data) {
  return prisma.challenge.update({
    where: { challenge_id: challengeId },
    data,
  });
}

/**
 * 챌린지 취소 (상태 변경)
 */
export async function cancelChallengeById(challengeId) {
  return prisma.challenge.update({
    where: { challenge_id: challengeId },
    data: { isClose: true, status: 'CANCELLED' },
  });
}

/**
 * 챌린지 삭제 (Soft Delete)
 */
export async function deleteChallengeById(challengeId, delete_reason) {
  return prisma.challenge.update({
    where: { challenge_id: challengeId },
    data: {
      isDelete: true,
      status: 'DELETED',
      delete_reason: delete_reason
    },
  });
}

/**
 * 챌린지 완전 삭제 (Hard Delete)
 */
export async function hardDeleteChallengeById(challengeId) {
  return prisma.challenge.delete({
    where: { challenge_id: challengeId },
  });
}

export default {
  createChallenge,
  updateChallengeById,
  cancelChallengeById,
  deleteChallengeById,
  hardDeleteChallengeById,
};
