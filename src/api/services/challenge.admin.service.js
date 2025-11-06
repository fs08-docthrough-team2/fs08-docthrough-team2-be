import * as challengeAdminRepository from '../repositories/challenge.admin.repository.js';
import { NotFoundError, UnauthorizedError, BadRequestError, ConflictError } from '../../utils/error.util.js';
import noticeService from './notice.service.js';

async function getChallengeList(searchKeyword, status, page, pageSize, sort) {
  try {
    // Where 조건 설정
    const whereCondition = {
      isDelete: false,
    };
    // 검색 키워드 처리 (챌린지 제목으로 검색)
    if (searchKeyword && searchKeyword.trim() !== '') {
      whereCondition.title = {
        contains: searchKeyword.trim(),
        mode: 'insensitive',
      };
    }
    // 신청 상태 필터
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
    const totalCount = await challengeAdminRepository.countChallenges(whereCondition);

    // 챌린지 목록 조회
    const challenges = await challengeAdminRepository.findChallengesForAdmin({
      where: whereCondition,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: orderBy,
    });

    // challenges가 배열인지 확인
    if (!Array.isArray(challenges)) {
      throw new BadRequestError(
        '관리자 챌린지 목록 조회에 실패했습니다. 데이터베이스에서 올바른 형식의 데이터를 반환받지 못했습니다. 잠시 후 다시 시도하거나 시스템 관리자에게 문의해주세요.',
        'ADMIN_CHALLENGE_LIST_FETCH_FAILED'
      );
    }

    // 응답 데이터 포맷팅
    const formattedChallenges = challenges.map((challenge) => ({
      challenge_no: challenge.challenge_no,
      challenge_id: challenge.challenge_id,
      type: challenge.type,
      field: challenge.field,
      title: challenge.title,
      participants: challenge._count.attends,
      maxParticipants: challenge.capacity,
      appliedDate: challenge.created_at,
      deadline: challenge.deadline,
      status: challenge.status,
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
    const challengeDetail = await challengeAdminRepository.findChallengeById(challengeId);

    // 챌린지가 존재하지 않으면 에러
    if (!challengeDetail) {
      throw new NotFoundError(
        `챌린지 ID '${challengeId}'를 찾을 수 없습니다. 챌린지가 존재하지 않거나 삭제되었을 수 있습니다. 챌린지 ID를 확인해주세요.`,
        'CHALLENGE_NOT_FOUND'
      );
    }

    // 결과를 반환
    return {
      success: true,
      data: {
        no: challengeDetail.challenge_no,
        title: challengeDetail.title,
        type: challengeDetail.type,
        field: challengeDetail.field,
        content: challengeDetail.content,
        deadline: challengeDetail.deadline,
        capacity: challengeDetail.capacity,
        source: challengeDetail.source,
      },
    };
  } catch (error) {
    throw error;
  }
}

async function approveChallenge(challengeId) {
  try {
    // 챌린지 승인 상태 변경
    const approvedChallenge = await challengeAdminRepository.approveChallengeById(challengeId);

    // 챌린지가 존재하지 않으면 에러
    if (!approvedChallenge) {
      throw new NotFoundError(
        `승인할 챌린지 ID '${challengeId}'를 찾을 수 없습니다. 챌린지가 존재하지 않거나 이미 삭제되었을 수 있습니다. 챌린지 ID를 확인해주세요.`,
        'CHALLENGE_NOT_FOUND'
      );
    }

    // 승인 알림 전송
    await noticeService.addChallengeStateNotice(
      '승인',
      approvedChallenge.user_id,
      approvedChallenge.title,
    );

    // 결과를 반환
    return {
      success: true,
      message: '챌린지가 승인되었습니다.',
      data: {
        approvedChallenge: approvedChallenge,
      },
    };
  } catch (error) {
    throw error;
  }
}

async function rejectChallenge(challengeId, reject_comment) {
  try {
    // 챌린지 거절 상태 변경
    const rejectedChallenge = await challengeAdminRepository.rejectChallengeById(
      challengeId,
      reject_comment
    );

    // 챌린지가 존재하지 않으면 에러
    if (!rejectedChallenge) {
      throw new NotFoundError(
        `거절할 챌린지 ID '${challengeId}'를 찾을 수 없습니다. 챌린지가 존재하지 않거나 이미 삭제되었을 수 있습니다. 챌린지 ID를 확인해주세요.`,
        'CHALLENGE_NOT_FOUND'
      );
    }

    // 거절 알림 전송 (사유 포함)
    await noticeService.addAdminChallengeUpdateNotice(
      '거절',
      rejectedChallenge.user_id,
      rejectedChallenge.title,
      reject_comment,
    );

    // 결과를 반환
    return {
      success: true,
      message: '챌린지가 거절되었습니다.',
      data: {
        rejectedChallenge: rejectedChallenge,
      },
    };
  } catch (error) {
    throw error;
  }
}

export default {
  getChallengeList,
  getChallengeDetail,
  approveChallenge,
  rejectChallenge,
};
