import challengeService from '../services/challenge.inquiry.service.js';
import isUUID from 'is-uuid';
// enum 값 불러오기
import { ChallengeField, ChallengeStatus, ChallengeType } from '@prisma/client';
// 상수 임포트
import HTTP_STATUS from '../../constants/http.constant.js';
import { VALIDATION_MESSAGE } from '../../constants/message.constant.js';
import { PAGINATION, SORT_ORDER } from '../../constants/pagination.constant.js';

async function getChallengeListInput(req, res) {
  // 입력값 불러오기
  let { title, field, type, status, page = PAGINATION.DEFAULT_PAGE, pageSize = PAGINATION.DEFAULT_PAGE_SIZE, sort = SORT_ORDER.ASC } = req.query;
  const pageNum = Number(page);
  const pageSizeNum = Number(pageSize);

  // 입력값 검증
  if (title && title.trim() === '') {
    title = undefined;
  }
  if (field && !Object.values(ChallengeField).includes(field)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: VALIDATION_MESSAGE.INVALID_FIELD });
  }
  if (type && !Object.values(ChallengeType).includes(type)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: VALIDATION_MESSAGE.INVALID_TYPE });
  }
  if (status && !Object.values(ChallengeStatus).includes(status)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: VALIDATION_MESSAGE.INVALID_STATUS });
  }
  if (!Number.isInteger(pageNum) || !Number.isInteger(pageSizeNum)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: VALIDATION_MESSAGE.INVALID_PAGINATION });
  }
  if (pageNum < PAGINATION.MIN_PAGE || pageSizeNum < PAGINATION.MIN_PAGE_SIZE) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: VALIDATION_MESSAGE.INVALID_PAGE_MIN });
  }
  if (pageSizeNum > PAGINATION.MAX_PAGE_SIZE) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: VALIDATION_MESSAGE.INVALID_PAGE_SIZE_MAX });
  }
  if (!Object.values(SORT_ORDER).includes(sort)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: VALIDATION_MESSAGE.INVALID_SORT });
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

  // 호출 결과 반환
  return res.status(HTTP_STATUS.OK).json(listData);
}

async function getChallengeDetailInput(req, res) {
  // 입력값 불러오기 및 데이터 검증
  const challengeID = !isUUID.v4(req.params.challengeId) ? undefined : req.params.challengeId;

  // 입력값 검증
  if (!challengeID) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: VALIDATION_MESSAGE.INVALID_CHALLENGE_ID
    });
  }

  // 서비스 호출
  const detailData = await challengeService.getChallengeDetail(challengeID);

  // 호출 결과 반환
  return res.status(HTTP_STATUS.OK).json(detailData);
}

async function getParticipateListInput(req, res) {
  // 입력값 불러오기
  const { page, pageSize } = req.query;
  const challengeID = !isUUID.v4(req.params.challengeId) ? undefined : req.params.challengeId;
  const pageNum = Number(page);
  const pageSizeNum = Number(pageSize);

  // 입력값 검증
    if (!challengeID) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: VALIDATION_MESSAGE.INVALID_CHALLENGE_ID
      });
    }
  if (!Number.isInteger(pageNum) || !Number.isInteger(pageSizeNum)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: VALIDATION_MESSAGE.INVALID_PAGINATION,
    });
  }
  if (pageNum < PAGINATION.MIN_PAGE || pageSizeNum < PAGINATION.MIN_PAGE_SIZE) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: VALIDATION_MESSAGE.INVALID_PAGE_MIN,
    });
  }

  // 서비스 호출
  const participateData = await challengeService.getParticipateList(
    challengeID,
    pageNum,
    pageSizeNum,
  );

  // 호출 결과 반환
  return res.status(HTTP_STATUS.OK).json(participateData);
}

async function getUserParticipateListInput(req, res) {
    // 입력값 불러오기
    const userID = !isUUID.v4(req.auth?.userId) ? undefined : req.auth?.userId;
    let { page = PAGINATION.DEFAULT_PAGE, pageSize = PAGINATION.DEFAULT_PAGE_SIZE, title, field, type, status } = req.query;
    const pageNum = Number(page);
    const pageSizeNum = Number(pageSize);

    // 입력값 검증
    if (!userID) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: VALIDATION_MESSAGE.INVALID_ID
      });
    }
    if (title && title.trim() === '') {
      title = undefined;
    }
    if (field && !Object.values(ChallengeField).includes(field)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: VALIDATION_MESSAGE.INVALID_FIELD });
    }
    if (type && !Object.values(ChallengeType).includes(type)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: VALIDATION_MESSAGE.INVALID_TYPE });
    }
    if (status && !Object.values(ChallengeStatus).includes(status)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: VALIDATION_MESSAGE.INVALID_STATUS });
    }
    if (!Number.isInteger(pageNum) || !Number.isInteger(pageSizeNum)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: VALIDATION_MESSAGE.INVALID_PAGINATION });
    }
    if (pageNum < PAGINATION.MIN_PAGE || pageSizeNum < PAGINATION.MIN_PAGE_SIZE) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: VALIDATION_MESSAGE.INVALID_PAGE_MIN });
    }
    if (pageSizeNum > PAGINATION.MAX_PAGE_SIZE) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: VALIDATION_MESSAGE.INVALID_PAGE_SIZE_MAX });
    }

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
}

async function getUserCompleteListInput(req, res) {
  // 입력값 불러오기
  const userID = !isUUID.v4(req.auth?.userId) ? undefined : req.auth?.userId;
  let { page = PAGINATION.DEFAULT_PAGE, pageSize = PAGINATION.DEFAULT_PAGE_SIZE, title, field, type, status } = req.query;
  const pageNum = Number(page);
  const pageSizeNum = Number(pageSize);

  // 입력값 검증
  if (!userID) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: VALIDATION_MESSAGE.INVALID_ID
    });
  }
  if (title && title.trim() === '') {
    title = undefined;
  }
  if (field && !Object.values(ChallengeField).includes(field)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: VALIDATION_MESSAGE.INVALID_FIELD });
  }
  if (type && !Object.values(ChallengeType).includes(type)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: VALIDATION_MESSAGE.INVALID_TYPE });
  }
  if (status && !Object.values(ChallengeStatus).includes(status)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: VALIDATION_MESSAGE.INVALID_STATUS });
  }
  if (!Number.isInteger(pageNum) || !Number.isInteger(pageSizeNum)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: VALIDATION_MESSAGE.INVALID_PAGINATION });
  }
  if (pageNum < PAGINATION.MIN_PAGE || pageSizeNum < PAGINATION.MIN_PAGE_SIZE) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: VALIDATION_MESSAGE.INVALID_PAGE_MIN });
  }
  if (pageSizeNum > PAGINATION.MAX_PAGE_SIZE) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: VALIDATION_MESSAGE.INVALID_PAGE_SIZE_MAX });
  }

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
}

async function getUserChallengeDetailInput(req, res) {
  // 입력값 불러오기
  const userID = !isUUID.v4(req.auth?.userId) ? undefined : req.auth?.userId;
  let { page = PAGINATION.DEFAULT_PAGE, pageSize = PAGINATION.DEFAULT_PAGE_SIZE, title, field, type, status } = req.query;
  const pageNum = Number(page);
  const pageSizeNum = Number(pageSize);

  // 입력 검증
  if (!userID) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: VALIDATION_MESSAGE.INVALID_ID
    });
  }
  if (title && title.trim() === '') {
    title = undefined;
  }
  if (field && !Object.values(ChallengeField).includes(field)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: VALIDATION_MESSAGE.INVALID_FIELD });
  }
  if (type && !Object.values(ChallengeType).includes(type)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: VALIDATION_MESSAGE.INVALID_TYPE });
  }
  if (status && !Object.values(ChallengeStatus).includes(status)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: VALIDATION_MESSAGE.INVALID_STATUS });
  }
  if (!Number.isInteger(pageNum) || !Number.isInteger(pageSizeNum)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: VALIDATION_MESSAGE.INVALID_PAGINATION });
  }
  if (pageNum < PAGINATION.MIN_PAGE || pageSizeNum < PAGINATION.MIN_PAGE_SIZE) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: VALIDATION_MESSAGE.INVALID_PAGE_MIN });
  }
  if (pageSizeNum > PAGINATION.MAX_PAGE_SIZE) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: VALIDATION_MESSAGE.INVALID_PAGE_SIZE_MAX });
  }

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
}

export default {
  getChallengeListInput,
  getChallengeDetailInput,
  getParticipateListInput,
  getUserParticipateListInput,
  getUserCompleteListInput,
  getUserChallengeDetailInput,
};
