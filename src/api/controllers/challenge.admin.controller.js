// 설명: 요청 파싱(params/query/body) + 입력 검증 결과 처리하는 파일입니다.
import challengeAdminServices from '../services/challenge.admin.service.js';
import isUUID from 'is-uuid';
import HTTP_STATUS from '../../constants/http.constant.js';
import { VALIDATION_MESSAGE } from '../../constants/message.constant.js';
import { PAGINATION } from '../../constants/pagination.constant.js';

// 선택지에 대한 상수화
const SORTLIST = ['신청시간빠름순', '신청시간느림순', '마감기한빠름순', '마감기한느림순', 'desc', 'asc'];
const STATUSLIST = ['신청승인', '신청거절', '신청취소', '신청대기'];

async function getChallengeListInput(req, res) {
  // 입력값 불러오기
  const { searchKeyword, status, sort = 'desc' } = req.query;
  const page = parseInt(req.query.page) || PAGINATION.DEFAULT_PAGE;
  const pageSize = parseInt(req.query.pageSize) || PAGINATION.DEFAULT_PAGE_SIZE;

  // 입력값 검증
  if (page <= 0 || pageSize <= 0) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: VALIDATION_MESSAGE.INVALID_PAGE_MIN
    });
  }
  if (sort && !SORTLIST.includes(sort)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: VALIDATION_MESSAGE.INVALID_SORT
    });
  }
  if (status && !STATUSLIST.includes(status)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: VALIDATION_MESSAGE.INVALID_STATUS
    });
  }

  // 서비스 호출
  const response = await challengeAdminServices.getChallengeList(
    searchKeyword, status, page, pageSize, sort
  );

  // 호출 결과 반환
  return res.status(HTTP_STATUS.OK).json(response);
}

async function getChallengeDetailInput(req, res) {
  // 입력값 불러오기
  const challengeID = !isUUID.v4(req.params.challengeId) ? undefined : req.params.challengeId;

  // 입력값 검증
  if (!challengeID) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: VALIDATION_MESSAGE.INVALID_CHALLENGE_ID
    });
  }

  // 서비스 호출
  const response = await challengeAdminServices.getChallengeDetail(
    challengeID
  );

  // 호출 결과 반환
  return res.status(HTTP_STATUS.OK).json(response);
}

async function approveChallengeInput(req, res) {
  // 입력값 불러오기
  const challengeID = !isUUID.v4(req.params.challengeId) ? undefined : req.params.challengeId;
  const userID = !isUUID.v4(req.auth?.userId) ? undefined : req.auth?.userId;

  // 입력값 검증
  if (!userID) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: VALIDATION_MESSAGE.INVALID_ID
    });
  }
  if (!challengeID) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: VALIDATION_MESSAGE.INVALID_CHALLENGE_ID
    });
  }

  // 서비스 호출
  const response = await challengeAdminServices.approveChallenge(
    challengeID, userID
  );

  // 호출 결과 반환
  return res.status(HTTP_STATUS.OK).json(response);
}

async function rejectChallengeInput(req, res) {
  // 입력값 불러오기
  const challengeID = !isUUID.v4(req.params.challengeId) ? undefined : req.params.challengeId;
  const userID = !isUUID.v4(req.auth?.userId) ? undefined : req.auth?.userId;
  const { reject_comment } = req.body;

  // 입력값 검증
  if (!userID) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: VALIDATION_MESSAGE.INVALID_ID
    });
  }
  if (!challengeID) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: VALIDATION_MESSAGE.INVALID_CHALLENGE_ID
    });
  }
  if (!reject_comment || reject_comment.trim() === '') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: VALIDATION_MESSAGE.REQUIRED_REJECT_COMMENT
    });
  }

  // 서비스 호출
  const response = await challengeAdminServices.rejectChallenge(
    challengeID, reject_comment, userID
  );

  // 호출 결과 반환
  return res.status(HTTP_STATUS.OK).json(response);
}

export default {
  getChallengeListInput,
  getChallengeDetailInput,
  approveChallengeInput,
  rejectChallengeInput
};