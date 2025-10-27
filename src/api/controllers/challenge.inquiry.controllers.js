import challengeService from '../services/challenge.inquiry.services.js';

async function getChallengeListInput(req, res, next) {
  try {
    // 요청 파라미터 추출
    let { title, field, type, status, page = 1, pageSize = 10, sort = 'asc' } = req.query;

    // title이 빈 문자열이면 undefined로 처리
    if (title && title.trim() === '') {
      title = undefined;
    }

    // 입력 검증
    if (field && !['NEXT', 'MODERN', 'API', 'WEB', 'CAREER'].includes(field)) {
      return res.status(400).json({ message: '필드 값이 올바르지 않습니다.' });
    }

    if (type && !['OFFICIAL', 'BLOG'].includes(type)) {
      return res.status(400).json({ message: '타입 값이 올바르지 않습니다.' });
    }

    if (status && !['INPROGRESS', 'DEADLINE'].includes(status)) {
      return res.status(400).json({ message: '상태 값이 올바르지 않습니다.' });
    }

    const pageNum = Number(page);
    const pageSizeNum = Number(pageSize);

    if (!Number.isInteger(pageNum) || !Number.isInteger(pageSizeNum)) {
      return res.status(400).json({ message: '페이지 또는 페이지 크기 값이 올바르지 않습니다.' });
    }

    if (pageNum < 1 || pageSizeNum < 1) {
      return res.status(400).json({ message: '페이지 또는 페이지 크기 값은 1 이상이어야 합니다.' });
    }

    if (pageSizeNum > 100) {
      return res.status(400).json({ message: '페이지 크기는 100 이하여야 합니다.' });
    }

    if (!['asc', 'desc'].includes(sort)) {
      return res.status(400).json({ message: '정렬 값이 올바르지 않습니다.' });
    }

    // 서비스 호출
    const listData = await challengeService.getChallengeList({
      title,
      field,
      type,
      status,
      page: pageNum,
      pageSize: pageSizeNum,
      sort,
    });

    // 응답 반환
    return res.status(200).json(listData);
  } catch (error) {
    next(error);
  }
}

async function getChallengeDetailInput(req, res, next) {
  const { challengeId } = req.params;

  try {
    // 입력 검증 (UUID 검증)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(challengeId)) {
      return res.status(400).json({
        message: '유효하지 않은 챌린지 ID 형식입니다.',
      });
    }

    // 서비스 호출
    const detailData = await challengeService.getChallengeDetail(challengeId);

    // 응답 반환
    return res.status(200).json(detailData);
  } catch (error) {
    next(error);
  }
}

async function getParticipateListInput(req, res, next) {
  const { challengeId } = req.params;
  const { page, pageSize } = req.query;

  try {
    // 입력 검증 (UUID 검증)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(challengeId)) {
      return res.status(400).json({
        message: '유효하지 않은 챌린지 ID 형식입니다.',
      });
    }

    // 페이지네이션 검증
    const pageNum = Number(page);
    const pageSizeNum = Number(pageSize);

    if (!Number.isInteger(pageNum) || !Number.isInteger(pageSizeNum)) {
      return res.status(400).json({
        message: '페이지 또는 페이지 크기 값이 올바르지 않습니다.',
      });
    }

    if (pageNum < 1 || pageSizeNum < 1) {
      return res.status(400).json({
        message: '페이지 또는 페이지 크기 값은 1 이상이어야 합니다.',
      });
    }

    // 서비스 호출
    const participateData = await challengeService.getParticipateList(
      challengeId,
      pageNum,
      pageSizeNum,
    );

    // 응답 반환
    return res.status(200).json(participateData);
  } catch (error) {
    next(error);
  }
}

async function getUserParticipateListInput(req, res, next) {
  try {
    const { userEmail } = req.params;
    const { page, pageSize, title, field, type, status } = req.query;

    // 입력 검증
    if (!userEmail || userEmail.trim() === '') {
      return res.status(400).json({ message: '유저 이메일이 필요합니다.' });
    }

    if (field && !['NEXT', 'MODERN', 'API', 'WEB', 'CAREER'].includes(field)) {
      return res.status(400).json({ message: '필드 값이 올바르지 않습니다.' });
    }

    if (type && !['OFFICIAL', 'BLOG'].includes(type)) {
      return res.status(400).json({ message: '타입 값이 올바르지 않습니다.' });
    }

    if (status && !['INPROGRESS', 'DEADLINE'].includes(status)) {
      return res.status(400).json({ message: '상태 값이 올바르지 않습니다.' });
    }

    const pageNum = Number(page);
    const pageSizeNum = Number(pageSize);

    if (!Number.isInteger(pageNum) || !Number.isInteger(pageSizeNum)) {
      return res.status(400).json({ message: '페이지 또는 페이지 크기 값이 올바르지 않습니다.' });
    }

    if (pageNum < 1 || pageSizeNum < 1) {
      return res.status(400).json({ message: '페이지 또는 페이지 크기 값은 1 이상이어야 합니다.' });
    }

    if (pageSizeNum > 100) {
      return res.status(400).json({ message: '페이지 크기는 100 이하여야 합니다.' });
    }

    // 서비스 호출
    const userParticipateData = await challengeService.getUserParticipateList(
      userEmail,
      title,
      field,
      type,
      status,
      pageNum,
      pageSizeNum,
    );

    // 응답 반환
    return res.status(200).json(userParticipateData);
  } catch (error) {
    next(error);
  }
}

async function getUserCompleteListInput(req, res, next) {
  try {
    const { userEmail } = req.params;
    const { page, pageSize, title, field, type, status } = req.query;

    // 입력 검증
    if (!userEmail || userEmail.trim() === '') {
      return res.status(400).json({ message: '유저 이메일이 필요합니다.' });
    }

    if (field && !['NEXT', 'MODERN', 'API', 'WEB', 'CAREER'].includes(field)) {
      return res.status(400).json({ message: '필드 값이 올바르지 않습니다.' });
    }

    if (type && !['OFFICIAL', 'BLOG'].includes(type)) {
      return res.status(400).json({ message: '타입 값이 올바르지 않습니다.' });
    }

    if (status && !['INPROGRESS', 'DEADLINE'].includes(status)) {
      return res.status(400).json({ message: '상태 값이 올바르지 않습니다.' });
    }

    const pageNum = Number(page);
    const pageSizeNum = Number(pageSize);

    if (!Number.isInteger(pageNum) || !Number.isInteger(pageSizeNum)) {
      return res.status(400).json({ message: '페이지 또는 페이지 크기 값이 올바르지 않습니다.' });
    }

    if (pageNum < 1 || pageSizeNum < 1) {
      return res.status(400).json({ message: '페이지 또는 페이지 크기 값은 1 이상이어야 합니다.' });
    }

    if (pageSizeNum > 100) {
      return res.status(400).json({ message: '페이지 크기는 100 이하여야 합니다.' });
    }

    // 서비스 호출
    const userCompleteData = await challengeService.getUserCompleteList(
      userEmail,
      title,
      field,
      type,
      status,
      pageNum,
      pageSizeNum,
    );

    // 응답 반환
    return res.status(200).json(userCompleteData);
  } catch (error) {
    next(error);
  }
}

export default {
  getChallengeListInput,
  getChallengeDetailInput,
  getParticipateListInput,

  getUserParticipateListInput,
  getUserCompleteListInput,
};
