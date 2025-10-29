// 설명: 요청 파싱(params/query/body) + 입력 검증 결과 처리하는 파일입니다.
import challengeAdminServices from '../services/challenge.admin.services.js';
import isUUID from 'is-uuid';

async function getChallengeListInput(req, res, next) {
  const { searchKeyword, status, sort = 'desc' } = req.query;
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  if (page <= 0 || pageSize <= 0) {
    return res.status(400).json({
      success: false,
      message: "페이지 번호와 페이지 크기는 1 이상의 값이어야 합니다."
    });
  }

  if (sort && !['신청시간빠름순', '신청시간느림순', '마감기한빠름순', '마감기한느림순', 'desc', 'asc'].includes(sort)) {
    return res.status(400).json({
      success: false,
      message: "유효하지 않은 정렬 기준입니다."
    });
  }

  if (status && !['신청승인', '신청거절', '신청취소', '신청대기'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "유효하지 않은 상태 필터입니다."
    });
  }

  const response = await challengeAdminServices.getChallengeList(searchKeyword, status, page, pageSize, sort);
  return res.status(200).json(response);
}

async function getChallengeDetailInput(req, res, next) {
  const { challengeId } = req.params;

  if (!challengeId || !isUUID.v4(challengeId)) {
    return res.status(400).json({
      success: false,
      message: "챌린지 ID가 필요합니다."
    });
  }

  const response = await challengeAdminServices.getChallengeDetail(challengeId);
  return res.status(200).json(response);
}

async function approveChallengeInput(req, res, next) {
  const { challengeId } = req.params;

  if (!challengeId || !isUUID.v4(challengeId)) {
    return res.status(400).json({
      success: false,
      message: "챌린지 ID가 필요합니다."
    });
  }

  const response = await challengeAdminServices.approveChallenge(challengeId);
  return res.status(200).json(response);
}

async function rejectChallengeInput(req, res, next) {
  const { challengeId } = req.params;
  const { reject_comment } = req.body;

  if (!reject_comment || reject_comment.trim() === '') {
    return res.status(400).json({
      success: false,
      message: "거절 사유를 입력해주세요."
    });
  }

  if (!challengeId || !isUUID.v4(challengeId)) {
    return res.status(400).json({
      success: false,
      message: "챌린지 ID가 필요합니다."
    });
  }

  const response = await challengeAdminServices.rejectChallenge(challengeId, reject_comment);
  return res.status(200).json(response);
}

export default {
  getChallengeListInput,
  getChallengeDetailInput,
  approveChallengeInput,
  rejectChallengeInput
};