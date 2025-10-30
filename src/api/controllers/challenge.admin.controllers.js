// 설명: 요청 파싱(params/query/body) + 입력 검증 결과 처리하는 파일입니다.
import challengeAdminServices from '../services/challenge.admin.services.js';
import isUUID from 'is-uuid';

// 선택지에 대한 상수화
const SORTLIST = ['신청시간빠름순', '신청시간느림순', '마감기한빠름순', '마감기한느림순', 'desc', 'asc'];
const STATUSLIST = ['신청승인', '신청거절', '신청취소', '신청대기'];

async function getChallengeListInput(req, res) {
  // 입력값 불러오기
  const { searchKeyword, status, sort = 'desc' } = req.query;
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  // 입력값 검증
  if (page <= 0 || pageSize <= 0) {
    return res.status(400).json({
      success: false,
      message: "페이지 번호와 페이지 크기는 1 이상의 값이어야 합니다."
    });
  }
  if (sort && !SORTLIST.includes(sort)) {
    return res.status(400).json({
      success: false,
      message: "유효하지 않은 정렬 기준입니다."
    });
  }
  if (status && !STATUSLIST.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "유효하지 않은 상태 필터입니다."
    });
  }

  // 서비스 호출
  const response = await challengeAdminServices.getChallengeList(
    searchKeyword, status, page, pageSize, sort
  );

  // 호출 결과 반환
  return res.status(200).json(response);
}

async function getChallengeDetailInput(req, res) {
  // 입력값 불러오기
  const challengeID = !isUUID.v4(req.params.challengeId) ? undefined : req.params.challengeId;

  // 입력값 검증
  if (!challengeID) {
    return res.status(400).json({
      success: false,
      message: "챌린지 ID가 없거나 올바르지 않습니다."
    });
  }

  // 서비스 호출
  const response = await challengeAdminServices.getChallengeDetail(
    challengeID
  );

  // 호출 결과 반환
  return res.status(200).json(response);
}

async function approveChallengeInput(req, res) {
  // 입력값 불러오기
  const challengeID = !isUUID.v4(req.params.challengeId) ? undefined : req.params.challengeId;
  const userID = !isUUID.v4(req.auth?.userId) ? undefined : req.auth?.userId;

  // 입력값 검증
  if (!userID) {
    return res.status(400).json({
      success: false,
      message: "유저 ID가 없거나 올바르지 않습니다."
    });
  }
  if (!challengeID) {
    return res.status(400).json({
      success: false,
      message: "챌린지 ID가 없거나 올바르지 않습니다."
    });
  }

  // 서비스 호출
  const response = await challengeAdminServices.approveChallenge(
    challengeID, userID
  );

  // 호출 결과 반환
  return res.status(200).json(response);
}

async function rejectChallengeInput(req, res) {
  // 입력값 불러오기
  const challengeID = !isUUID.v4(req.params.challengeId) ? undefined : req.params.challengeId;
  const userID = !isUUID.v4(req.auth?.userId) ? undefined : req.auth?.userId;
  const { reject_comment } = req.body;

  // 입력값 검증
  if (!userID) {
    return res.status(400).json({
      success: false,
      message: "유저 ID가 없거나 올바르지 않습니다."
    });
  }
  if (!challengeID) {
    return res.status(400).json({
      success: false,
      message: "챌린지 ID가 없거나 올바르지 않습니다."
    });
  }
  if (!reject_comment || reject_comment.trim() === '') {
    return res.status(400).json({
      success: false,
      message: "거절 사유를 입력해주세요."
    });
  }

  // 서비스 호출
  const response = await challengeAdminServices.rejectChallenge(
    challengeID, reject_comment, userID
  );

  // 호출 결과 반환
  return res.status(200).json(response);
}

export default {
  getChallengeListInput,
  getChallengeDetailInput,
  approveChallengeInput,
  rejectChallengeInput
};