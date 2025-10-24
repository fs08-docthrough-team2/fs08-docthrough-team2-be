import prisma from '../../common/prisma.js';

async function getChallengeList({ title, field, type, status, page, pageSize, sort }) {
  try {
    // where 조건 동적 생성
    const whereCondition = {
      isDelete: false,
    };

    // title이 존재하고 빈 문자열이 아닐 때만 검색 조건 추가
    if (title && title.trim() !== '') {
      whereCondition.title = {
        contains: title.trim(),
        mode: 'insensitive',
      };
    }

    if (field) {
      whereCondition.field = field;
    }

    if (type) {
      whereCondition.type = type;
    }

    if (status) {
      whereCondition.status = status;
    }

    // 전체 개수 조회
    const totalCount = await prisma.challenge.count({
      where: whereCondition,
    });

    // 챌린지 목록 조회
    const challenges = await prisma.challenge.findMany({
      select: {
        challenge_id: true,
        title: true,
        field: true,
        type: true,
        status: true,
        deadline: true,
        capacity: true,
        _count: {
          select: {
            attends: true,
          },
        },
      },
      where: whereCondition,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        deadline: sort,
      },
    });

    console.log(`Found ${challenges.length} challenges`); // 디버깅용

    // 응답 데이터 포맷팅
    const formattedChallenges = challenges.map((challenge) => ({
      challengeId: challenge.challenge_id,
      title: challenge.title,
      field: challenge.field,
      type: challenge.type,
      status: challenge.status,
      deadline: challenge.deadline,
      currentParticipants: challenge._count.attends,
      maxParticipants: parseInt(challenge.capacity),
    }));

    return {
      success: true,
      data: formattedChallenges,
      pagination: {
        page: page,
        pageSize: pageSize,
        totalCount: totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    };
  } catch (error) {
    throw error;
  }
}

async function getChallengeDetail(challengeId) {
  try {
    const challenge = await prisma.challenge.findUnique({
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

    if (!challenge) {
      return {
        success: false,
        message: '챌린지를 찾을 수 없습니다.',
      };
    }

    return {
      success: true,
      data: {
        challengeId: challenge.challenge_id,
        title: challenge.title,
        content: challenge.content,
        field: challenge.field,
        type: challenge.type,
        status: challenge.status,
        deadline: challenge.deadline,
        currentParticipants: challenge._count.attends,
        maxParticipants: parseInt(challenge.capacity),
        source: challenge.source,
      },
    };
  } catch (error) {
    throw error;
  }
}

export default {
  getChallengeList,
  getChallengeDetail,
};
