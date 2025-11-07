// 설명: 요청 파싱(params/query/body) + 입력 검증 결과 처리하는 파일입니다.
import { asyncHandler } from '../../middleware/error.middleware.js';
import challengeAdminServices from '../services/challenge.admin.service.js';
import HTTP_STATUS from '../../constants/http.constant.js';
import { PAGINATION } from '../../constants/pagination.constant.js';
// 공통 검증 함수 임포트
import {
  validatePagination,
  validateEnum,
  validateChallengeId,
  validateUserId,
  validateRequiredString,
} from '../../utils/validation.util.js';
import { VALIDATION_ERROR_CODE } from '../../constants/error-code.constant.js';
import { VALIDATION_MESSAGE } from '../../constants/message.constant.js';

// 선택지에 대한 상수화
const SORTLIST = ['신청시간빠름순', '신청시간느림순', '마감기한빠름순', '마감기한느림순', 'desc', 'asc'];
const STATUSLIST = ['신청승인', '신청거절', '신청취소', '신청대기'];

const getChallengeListInput = asyncHandler(async (req, res) => {
  // 입력값 불러오기
  const { searchKeyword, status, sort = 'desc' } = req.query;
  const page = parseInt(req.query.page) || PAGINATION.DEFAULT_PAGE;
  const pageSize = parseInt(req.query.pageSize) || PAGINATION.DEFAULT_PAGE_SIZE;

  // 입력값 검증
  let valid = validatePagination(page, pageSize, res);
  if (valid !== true) return valid;

  valid = validateEnum(sort, SORTLIST, res, VALIDATION_ERROR_CODE.INVALID_SORT, VALIDATION_MESSAGE.INVALID_SORT);
  if (valid !== true) return valid;

  valid = validateEnum(status, STATUSLIST, res, VALIDATION_ERROR_CODE.INVALID_STATUS, VALIDATION_MESSAGE.INVALID_STATUS);
  if (valid !== true) return valid;

  // 서비스 호출
  const response = await challengeAdminServices.getChallengeList(
    searchKeyword, status, page, pageSize, sort
  );

  // 호출 결과 반환
  return res.status(HTTP_STATUS.OK).json(response);
});

const getChallengeDetailInput = asyncHandler(async (req, res) => {
  // 입력값 불러오기 및 검증
  const challengeID = req.params.challengeId;

  const valid = validateChallengeId(challengeID, res);
  if (valid !== true) return valid;

  // 서비스 호출
  const response = await challengeAdminServices.getChallengeDetail(
    challengeID
  );

  // 호출 결과 반환
  return res.status(HTTP_STATUS.OK).json(response);
});

const approveChallengeInput = asyncHandler(async (req, res) => {
  // 입력값 불러오기
  const challengeID = req.params.challengeId;
  const adminID = req.auth?.userId;

  // 입력값 검증
  let valid = validateUserId(adminID, res);
  if (valid !== true) return valid;

  valid = validateChallengeId(challengeID, res);
  if (valid !== true) return valid;

  // 서비스 호출
  const response = await challengeAdminServices.approveChallenge(
    challengeID, adminID
  );

  // 호출 결과 반환
  return res.status(HTTP_STATUS.OK).json(response);
});

const rejectChallengeInput = asyncHandler(async (req, res) => {
  // 입력값 불러오기
  const challengeID = req.params.challengeId;
  const userID = req.auth?.userId;
  const { reject_comment } = req.body;

  // 입력값 검증
  let valid = validateUserId(userID, res);
  if (valid !== true) return valid;

  valid = validateChallengeId(challengeID, res);
  if (valid !== true) return valid;

  valid = validateRequiredString(
    reject_comment,
    res,
    VALIDATION_ERROR_CODE.REQUIRED_REJECT_COMMENT,
    VALIDATION_MESSAGE.REQUIRED_REJECT_COMMENT
  );
  if (valid !== true) return valid;

  // 서비스 호출
  const response = await challengeAdminServices.rejectChallenge(
    challengeID, reject_comment, userID
  );

  // 호출 결과 반환
  return res.status(HTTP_STATUS.OK).json(response);
});

export default {
  getChallengeListInput,
  getChallengeDetailInput,
  approveChallengeInput,
  rejectChallengeInput
};