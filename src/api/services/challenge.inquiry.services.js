import prisma from '../../common/prisma.js';

async function getChallengeList() {
  try {
    const challenges = await prisma.challenge.findMany({
      select: {
        title: true,
        content: true,
        type: true,
        status: true,
        field: true,
        source: true,
        deadline: true,
        capacity: true,
      },
    });

    return challenges;
  } catch (error) {
    throw error;
  }
}

export default {
  getChallengeList,
};
