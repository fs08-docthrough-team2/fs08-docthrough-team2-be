import * as challengeInquiryRepository from '../repositories/challenge.inquiry.repository.js';

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

    // 정렬 조건 설정
    let orderBy;
    switch (sort) {
      case '신청시간빠름순':
        orderBy = { created_at: 'asc' };
        break;
      case '신청시간느림순':
        orderBy = { created_at: 'desc' };
        break;
      case '마감기한빠름순':
        orderBy = { deadline: 'asc' };
        break;
      case '마감기한느림순':
        orderBy = { deadline: 'desc' };
        break;
      default:
        orderBy = { created_at: 'desc' };
    }

    // 전체 개수 조회
    const totalCount = await challengeInquiryRepository.countChallenges(whereCondition);

    // 챌린지 목록 조회
    const challenges = await challengeInquiryRepository.findChallengesWithAttendCount({
      where: whereCondition,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: orderBy,
    });

    // challenges가 배열인지 확인
    if (!Array.isArray(challenges)) {
      throw new Error('챌린지 목록 조회에 실패했습니다.');
    }

    // 응답 데이터 포맷팅
    const formattedChallenges = challenges.map((challenge) => ({
      challengeId: challenge.challenge_id,
      title: challenge.title,
      field: challenge.field,
      type: challenge.type,
      status: challenge.status,
      appliedDate: challenge.created_at,
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
    const challenge = await challengeInquiryRepository.findChallengeDetailById(challengeId);
    // 결과를 찾을 수 없는 경우, 에러 던지기
    if (!challenge) {
      throw new Error('챌린지를 찾을 수 없습니다.');
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
    // 챌린지가 존재하는지 먼저 확인
    const challenge = await challengeInquiryRepository.findChallengeDetailById(challengeId);
    if (!challenge) {
      throw new Error('챌린지를 찾을 수 없습니다.');
    }

    // 참여자 목록 조회
    const participates = await challengeInquiryRepository.findParticipatesByChallenge({
      challengeId,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    // participates가 배열인지 확인
    if (!Array.isArray(participates)) {
      throw new Error('참여자 목록 조회에 실패했습니다.');
    }

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

async function getUserParticipateList(userID, title, field, type, status, page, pageSize, sort) {
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
      switch (status) {
        case '신청승인':
          whereCondition.status = 'APPROVED';
          break;
        case '신청거절':
          whereCondition.status = 'REJECTED';
          break;
        case '신청취소':
          whereCondition.status = 'CANCELLED';
          break;
        case '신청대기':
          whereCondition.status = 'PENDING';
          break;
      }
    }
    if (title) {
      whereCondition.title = {
        contains: title.trim(),
        mode: 'insensitive',
      };
    }

    // 정렬 조건 설정
    let orderBy;
    switch (sort) {
      case '신청시간빠름순':
        orderBy = { created_at: 'asc' };
        break;
      case '신청시간느림순':
        orderBy = { created_at: 'desc' };
        break;
      case '마감기한빠름순':
        orderBy = { deadline: 'asc' };
        break;
      case '마감기한느림순':
        orderBy = { deadline: 'desc' };
        break;
      default:
        orderBy = { created_at: 'desc' };
    }

    // 챌린지 목록 조회 - userId를 별도 파라미터로 전달
    const participates = await challengeInquiryRepository.findUserChallenges({
      userId: userID,
      where: whereCondition,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: orderBy,
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
      appliedDate: participate.created_at,
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

async function getUserCompleteList(userID, title, field, type, status, page, pageSize, sort) {
  try {
    // where 조건 설정 - 사용자가 참여한 완료된 챌린지
    const whereCondition = {
      isDelete: false,
      deadline: { lte: new Date() },
    };
    if (field) {
      whereCondition.field = field;
    }
    if (type) {
      whereCondition.type = type;
    }
    if (status) {
      switch (status) {
        case '신청승인':
          whereCondition.status = 'APPROVED';
          break;
        case '신청거절':
          whereCondition.status = 'REJECTED';
          break;
        case '신청취소':
          whereCondition.status = 'CANCELLED';
          break;
        case '신청대기':
          whereCondition.status = 'PENDING';
          break;
      }
    }
    if (title) {
      whereCondition.title = {
        contains: title.trim(),
        mode: 'insensitive',
      };
    }

    // 정렬 조건 설정
    let orderBy;
    switch (sort) {
      case '신청시간빠름순':
        orderBy = { created_at: 'asc' };
        break;
      case '신청시간느림순':
        orderBy = { created_at: 'desc' };
        break;
      case '마감기한빠름순':
        orderBy = { deadline: 'asc' };
        break;
      case '마감기한느림순':
        orderBy = { deadline: 'desc' };
        break;
      default:
        orderBy = { created_at: 'desc' };
    }

    // 챌린지 목록 조회 - userId를 별도 파라미터로 전달
    const participates = await challengeInquiryRepository.findUserChallenges({
      userId: userID,
      where: whereCondition,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: orderBy,
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
      appliedDate: participate.created_at,
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

async function getUserChallengeDetail(userID, title, field, type, status, page, pageSize, sort) {
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
      switch (status) {
        case '신청승인':
          whereCondition.status = 'APPROVED';
          break;
        case '신청거절':
          whereCondition.status = 'REJECTED';
          break;
        case '신청취소':
          whereCondition.status = 'CANCELLED';
          break;
        case '신청대기':
          whereCondition.status = 'PENDING';
          break;
      }
    }
    if (userID) {
      whereCondition.user_id = userID;
    }

    // 정렬 조건 설정
    let orderBy;
    switch (sort) {
      case '신청시간빠름순':
        orderBy = { created_at: 'asc' };
        break;
      case '신청시간느림순':
        orderBy = { created_at: 'desc' };
        break;
      case '마감기한빠름순':
        orderBy = { deadline: 'asc' };
        break;
      case '마감기한느림순':
        orderBy = { deadline: 'desc' };
        break;
      default:
        orderBy = { created_at: 'desc' };
    }
    if (title) {
      whereCondition.title = {
        contains: title.trim(),
        mode: 'insensitive',
      };
    }

    // 챌린지 목록 조회
    const participates = await challengeInquiryRepository.findUserChallengeDetails({
      where: whereCondition,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: orderBy,
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
      appliedDate: participate.created_at,
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