import prisma from '../../config/prisma.config.js';

async function getChallengeList({ title, field, type, status, page, pageSize, sort }) {
  try {
    // where 조건 설정
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

    // 결과를 반환
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
    // 챌린지 상세 내용 조회
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
    // 결과를 찾을 수 없는 경우, 에러 메시지 반환
    if (!challenge) {
      return {
        success: false,
        message: '챌린지를 찾을 수 없습니다.',
      };
    }

    // 결과를 반환
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

async function getParticipateList(challengeId, page, pageSize) {
  try {
    // 참여자 목록 조회
    const participates = await prisma.attend.findMany({
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
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    // 순위 추가
    const participatesWithRank = participates.map((participate, index) => ({
      rank: index + 1,
      attendId: participate.attend_id,
      userId: participate.user_id,
      nickName: participate.user.nick_name,
      hearts: participate._count.likes,
      lastSubmittedAt: participate.updated_at,
    }));

    // 결과를 반환
    return {
      success: true,
      data: {
        participates: participatesWithRank,
      },
      pagination: {
        page: page,
        pageSize: pageSize,
      },
    };
  } catch (error) {
    throw error;
  }
}

async function getUserParticipateList(userID, title, field, type, status, page, pageSize) {
  try {
    // Where 조건 설정 - 사용자가 참여한 챌린지 찾기
    const whereCondition = {
      isDelete: false,
      deadline: { gt: new Date() },
    };
    if (field) {
      whereCondition.field = field;
    }
    if (type) {
      whereCondition.type = type;
    }
    if (status) {
      whereCondition.status = status;
    }

    // 챌린지 목록 조회
    const participates = await prisma.challenge.findMany({
      where: whereCondition,
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

      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    // 응답 데이터 포맷팅
    const formattedParticipates = participates.map((participate) => ({
      challengeId: participate.challenge_id,
      title: participate.title,
      content: participate.content,
      type: participate.type,
      status: participate.status,
      field: participate.field,
      source: participate.source,
      deadline: participate.deadline,
      currentParticipants: participate._count.attends,
      maxParticipants: parseInt(participate.capacity),
    }));

    // 결과를 반환
    return {
      success: true,
      data: {
        participates: formattedParticipates,
      },
      pagination: {
        page: page,
        pageSize: pageSize,
      },
    };
  } catch (error) {
    throw error;
  }
}

async function getUserCompleteList(userID, title, field, type, status, page, pageSize) {
  try {
    // where 조건 설정 - 사용자가 참여한 완료된 챌린지
    const whereCondition = {
      isDelete: false,
      deadline: { lt: new Date() },
    };
    if (field) {
      whereCondition.field = field;
    }
    if (type) {
      whereCondition.type = type;
    }
    if (status) {
      whereCondition.status = status;
    }

    // 챌린지 목록 조회
    const participates = await prisma.challenge.findMany({
      where: whereCondition,
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

      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    // 응답 데이터 포맷팅
    const formattedParticipates = participates.map((participate) => ({
      challengeId: participate.challenge_id,
      title: participate.title,
      content: participate.content,
      type: participate.type,
      status: participate.status,
      field: participate.field,
      source: participate.source,
      deadline: participate.deadline,
      currentParticipants: participate._count.attends,
      maxParticipants: parseInt(participate.capacity),
    }));

    // 결과를 반환
    return {
      success: true,
      data: {
        participates: formattedParticipates,
      },
      pagination: {
        page: page,
        pageSize: pageSize,
      },
    };
  } catch (error) {
    throw error;
  }
}

async function getUserChallengeDetail(userID, title, field, type, status, page, pageSize) {
  try {
    // where 조건 설정
    const whereCondition = {
      isDelete: false,
      isClose: false,
      deadline: { gt: new Date() },
    };
    if (field) {
      whereCondition.field = field;
    }
    if (type) {
      whereCondition.type = type;
    }
    if (status) {
      whereCondition.status = status;
    }
    if (userID) {
      whereCondition.user_id = userID;
    }

    // 챌린지 목록 조회
    const participates = await prisma.challenge.findMany({
      where: whereCondition,
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

      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    // 응답 데이터 포맷팅
    const formattedParticipates = participates.map((participate) => ({
      challengeId: participate.challenge_id,
      title: participate.title,
      content: participate.content,
      type: participate.type,
      status: participate.status,
      field: participate.field,
      source: participate.source,
      deadline: participate.deadline,
      currentParticipants: participate._count.attends,
      maxParticipants: parseInt(participate.capacity),
      isReject: participate.isReject,
      rejectContent: participate.reject_content,
    }));

    // 결과를 반환
    return {
      success: true,
      data: {
        participates: formattedParticipates,
      },
      pagination: {
        page: page,
        pageSize: pageSize,
      },
    };
  } catch (error) {
    throw error;
  }
}

export default {
  getChallengeList,
  getChallengeDetail,
  getParticipateList,
  getUserParticipateList,
  getUserCompleteList,
  getUserChallengeDetail,
};