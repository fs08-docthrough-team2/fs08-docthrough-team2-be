import { asyncHandler } from '../../middleware/error.middleware.js';
import challengeService from '../services/challenge.inquiry.service.js';
// enum 값 불러오기
import { ChallengeField, ChallengeStatus, ChallengeType } from '@prisma/client';
// 상수 임포트
import HTTP_STATUS from '../../constants/http.constant.js';
import { PAGINATION, SORT_ORDER } from '../../constants/pagination.constant.js';
// 공통 검증 함수 임포트
import {
  validatePagination,
  validateChallengeField,
  validateChallengeType,
  validateChallengeStatus,
  validateSort,
  validateChallengeId,
  validateUserId,
  sanitizeString,
} from '../../utils/validation.util.js';

const getChallengeListInput = asyncHandler(async (req, res) => {
  // 입력값 불러오기
  let { title, field, type, status, page = PAGINATION.DEFAULT_PAGE, pageSize = PAGINATION.DEFAULT_PAGE_SIZE, sort = SORT_ORDER.ASC } = req.query;
  const pageNum = Number(page);
  const pageSizeNum = Number(pageSize);

  // 입력값 검증
  title = sanitizeString(title);

  let valid = validateChallengeField(field, res, ChallengeField);
  if (valid !== true) return valid;

  valid = validateChallengeType(type, res, ChallengeType);
  if (valid !== true) return valid;

  valid = validateChallengeStatus(status, res, ChallengeStatus);
  if (valid !== true) return valid;

  valid = validatePagination(pageNum, pageSizeNum, res);
  if (valid !== true) return valid;

  valid = validateSort(sort, res, SORT_ORDER);
  if (valid !== true) return valid;

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

  // 호출 결과 반환
  return res.status(HTTP_STATUS.OK).json(listData);
});

const getChallengeDetailInput = asyncHandler(async (req, res) => {
  // 입력값 불러오기 및 검증
  const challengeID = req.params.challengeId;

  const valid = validateChallengeId(challengeID, res);
  if (valid !== true) return valid;

  // 서비스 호출
  const detailData = await challengeService.getChallengeDetail(challengeID);

  // 호출 결과 반환
  return res.status(HTTP_STATUS.OK).json(detailData);
});

const getParticipateListInput = asyncHandler(async (req, res) => {
  // 입력값 불러오기
  const { page, pageSize } = req.query;
  const challengeID = req.params.challengeId;
  const pageNum = Number(page);
  const pageSizeNum = Number(pageSize);

  // 입력값 검증
  let valid = validateChallengeId(challengeID, res);
  if (valid !== true) return valid;

  valid = validatePagination(pageNum, pageSizeNum, res);
  if (valid !== true) return valid;

  // 서비스 호출
  const participateData = await challengeService.getParticipateList(
    challengeID,
    pageNum,
    pageSizeNum,
  );

  // 호출 결과 반환
  return res.status(HTTP_STATUS.OK).json(participateData);
});

const getUserParticipateListInput = asyncHandler(async (req, res) => {
    // 입력값 불러오기
    const userID = req.auth?.userId;
    let { page = PAGINATION.DEFAULT_PAGE, pageSize = PAGINATION.DEFAULT_PAGE_SIZE, title, field, type, status } = req.query;
    const pageNum = Number(page);
    const pageSizeNum = Number(pageSize);

    // 입력값 검증
    let valid = validateUserId(userID, res);
    if (valid !== true) return valid;

    title = sanitizeString(title);

    valid = validateChallengeField(field, res, ChallengeField);
    if (valid !== true) return valid;

    valid = validateChallengeType(type, res, ChallengeType);
    if (valid !== true) return valid;

    valid = validateChallengeStatus(status, res, ChallengeStatus);
    if (valid !== true) return valid;

    valid = validatePagination(pageNum, pageSizeNum, res);
    if (valid !== true) return valid;

    // 서비스 호출
    const userParticipateData = await challengeService.getUserParticipateList(
      userID,
      title,
      field,
      type,
      status,
      pageNum,
      pageSizeNum,
    );

    // 호출 결과 반환
    return res.status(HTTP_STATUS.OK).json(userParticipateData);
});

const getUserCompleteListInput = asyncHandler(async (req, res) => {
  // 입력값 불러오기
  const userID = req.auth?.userId;
  let { page = PAGINATION.DEFAULT_PAGE, pageSize = PAGINATION.DEFAULT_PAGE_SIZE, title, field, type, status } = req.query;
  const pageNum = Number(page);
  const pageSizeNum = Number(pageSize);

  // 입력값 검증
  let valid = validateUserId(userID, res);
  if (valid !== true) return valid;

  title = sanitizeString(title);

  valid = validateChallengeField(field, res, ChallengeField);
  if (valid !== true) return valid;

  valid = validateChallengeType(type, res, ChallengeType);
  if (valid !== true) return valid;

  valid = validateChallengeStatus(status, res, ChallengeStatus);
  if (valid !== true) return valid;

  valid = validatePagination(pageNum, pageSizeNum, res);
  if (valid !== true) return valid;

  // 서비스 호출
  const userCompleteData = await challengeService.getUserCompleteList(
    userID,
    title,
    field,
    type,
    status,
    pageNum,
    pageSizeNum,
  );

  // 호출 결과 반환
  return res.status(HTTP_STATUS.OK).json(userCompleteData);
});

const getUserChallengeDetailInput = asyncHandler(async (req, res) => {
  // 입력값 불러오기
  const userID = req.auth?.userId;
  let { page = PAGINATION.DEFAULT_PAGE, pageSize = PAGINATION.DEFAULT_PAGE_SIZE, title, field, type, status } = req.query;
  const pageNum = Number(page);
  const pageSizeNum = Number(pageSize);

  // 입력 검증
  let valid = validateUserId(userID, res);
  if (valid !== true) return valid;

  title = sanitizeString(title);

  valid = validateChallengeField(field, res, ChallengeField);
  if (valid !== true) return valid;

  valid = validateChallengeType(type, res, ChallengeType);
  if (valid !== true) return valid;

  valid = validateChallengeStatus(status, res, ChallengeStatus);
  if (valid !== true) return valid;

  valid = validatePagination(pageNum, pageSizeNum, res);
  if (valid !== true) return valid;

  // 서비스 호출
  const userChallengeDetailData = await challengeService.getUserChallengeDetail(
    userID,
    title,
    field,
    type,
    status,
    pageNum,
    pageSizeNum,
  );

  // 응답 반환
  return res.status(HTTP_STATUS.OK).json(userChallengeDetailData);
});

export default {
  getChallengeListInput,
  getChallengeDetailInput,
  getParticipateListInput,
  getUserParticipateListInput,
  getUserCompleteListInput,
  getUserChallengeDetailInput,
};
