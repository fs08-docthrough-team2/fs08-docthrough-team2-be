import prisma from '../../common/prisma.js';

async function createChallenge(title, source, field, type, deadline, capacity, content, email) {
  try {
    const user_id = await prisma.user.findUnique({
      where: { email },
      select: { user_id: true }
    });

    if (!user_id) {
      throw new Error('해당 이메일의 사용자를 찾을 수 없습니다.');
    }

    const newChallenge = await prisma.challenge.create({
      data: {
        user_id: user_id.user_id,
        title,
        source,
        field,
        type,
        deadline,
        capacity,
        content,
        status: 'INPROGRESS',
        isDelete: false,
        isClose: false,
        isReject: false,
      }
    });

    return {
      success: true,
      data: {
        newChallenge: newChallenge,
      }
    };
  } catch (error) {
    throw error;
  }
}

async function updateChallenge(req, res, next) {
  const updateChallenge = await prisma.challenge.update({
    where: { challenge_id: req.params.challengeId },
    data: req.body
  });
  return {
    success: true,
    data: {
      updateChallenge: updateChallenge,
    }
  };
}

async function cancelChallenge(req, res, next) {
  const updateChallenge = await prisma.challenge.update({
    where: { challenge_id: req.params.challengeId },
    data: { isClose: true, status: 'DEADLINE' }
  });
  return {
    success: true,
    data: {
      updateChallenge: updateChallenge,
    }
  };
}

async function deleteChallenge(req, res, next) {
  const updateChallenge = await prisma.challenge.update({
    where: { challenge_id: req.params.challengeId },
    data: { isDelete: true, status: 'DEADLINE' }
  });
  return {
    success: true,
    data: {
      updateChallenge: updateChallenge,
    }
  };
}

async function hardDeleteChallenge(req, res, next) {
  const deletedChallenge = await prisma.challenge.delete({
    where: { challenge_id: req.params.challengeId }
  });
  return {
    success: true,
    data: {
      deletedChallenge: deletedChallenge,
    }
  };
}

export default {
  createChallenge,
  updateChallenge,
  cancelChallenge,
  deleteChallenge,
  hardDeleteChallenge,
}