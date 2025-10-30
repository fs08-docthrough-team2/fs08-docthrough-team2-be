import challengeService from '../services/challenge.inquiry.services.js';
import isUUID from 'is-uuid';
// enum 값 불러오기
import { ChallengeField, ChallengeStatus, ChallengeType } from '@prisma/client';

async function getChallengeListInput(req, res) {
  // 입력값 불러오기
  let { title, field, type, status, page = 1, pageSize = 10, sort = 'asc' } = req.query;
  const pageNum = Number(page);
  const pageSizeNum = Number(pageSize);

  // 입력값 검증
  if (title && title.trim() === '') {
    title = undefined;
  }
  if (field && !Object.values(ChallengeField).includes(field)) {
    return res.status(400).json({ message: '필드 값이 올바르지 않습니다.' });
  }
  if (type && !Object.values(ChallengeType).includes(type)) {
    return res.status(400).json({ message: '타입 값이 올바르지 않습니다.' });
  }
  if (status && !Object.values(ChallengeStatus).includes(status)) {
    return res.status(400).json({ message: '상태 값이 올바르지 않습니다.' });
  }
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

  // 호출 결과 반환
  return res.status(200).json(listData);
}

async function getChallengeDetailInput(req, res) {
  // 입력값 불러오기 및 데이터 검증
  const challengeID = !isUUID.v4(req.params.challengeId) ? undefined : req.params.challengeId;

  // 입력값 검증
  if (!challengeID) {
    return res.status(400).json({
      success: false,
      message: "챌린지 ID가 없거나 올바르지 않습니다."
    });
  }

  // 서비스 호출
  const detailData = await challengeService.getChallengeDetail(challengeID);

  // 호출 결과 반환
  return res.status(200).json(detailData);
}

async function getParticipateListInput(req, res) {
  // 입력값 불러오기
  const { page, pageSize } = req.query;
  const challengeID = !isUUID.v4(req.params.challengeId) ? undefined : req.params.challengeId;
  const pageNum = Number(page);
  const pageSizeNum = Number(pageSize);

  // 입력값 검증
    if (!challengeID) {
      return res.status(400).json({
        success: false,
        message: "챌린지 ID가 없거나 올바르지 않습니다."
      });
    }
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
    challengeID,
    pageNum,
    pageSizeNum,
  );

  // 호출 결과 반환
  return res.status(200).json(participateData);
}

async function getUserParticipateListInput(req, res) {
    // 입력값 불러오기
    const userID = !isUUID.v4(req.auth?.userId) ? undefined : req.auth?.userId;
    let { page, pageSize, title, field, type, status } = req.query;
    const pageNum = Number(page);
    const pageSizeNum = Number(pageSize);

    // 입력값 검증
    if (!userID) {
      return res.status(400).json({
        success: false,
        message: "유저 ID가 없거나 올바르지 않습니다."
      });
    }
    if (title && title.trim() === '') {
      title = undefined;
    }
    if (field && !Object.values(ChallengeField).includes(field)) {
      return res.status(400).json({ message: '필드 값이 올바르지 않습니다.' });
    }
    if (type && !Object.values(ChallengeType).includes(type)) {
      return res.status(400).json({ message: '타입 값이 올바르지 않습니다.' });
    }
    if (status && !Object.values(ChallengeStatus).includes(status)) {
      return res.status(400).json({ message: '상태 값이 올바르지 않습니다.' });
    }
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
      userID,
      title,
      field,
      type,
      status,
      pageNum,
      pageSizeNum,
    );

    // 호출 결과 반환
    return res.status(200).json(userParticipateData);
}

async function getUserCompleteListInput(req, res) {
  // 입력값 불러오기
  const userID = !isUUID.v4(req.auth?.userId) ? undefined : req.auth?.userId;
  let { page, pageSize, title, field, type, status } = req.query;
  const pageNum = Number(page);
  const pageSizeNum = Number(pageSize);

  // 입력값 검증
  if (!userID) {
    return res.status(400).json({
      success: false,
      message: "유저 ID가 없거나 올바르지 않습니다."
    });
  }
  if (title && title.trim() === '') {
    title = undefined;
  }
  if (field && !Object.values(ChallengeField).includes(field)) {
    return res.status(400).json({ message: '필드 값이 올바르지 않습니다.' });
  }
  if (type && !Object.values(ChallengeType).includes(type)) {
    return res.status(400).json({ message: '타입 값이 올바르지 않습니다.' });
  }
  if (status && !Object.values(ChallengeStatus).includes(status)) {
    return res.status(400).json({ message: '상태 값이 올바르지 않습니다.' });
  }
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
    userID,
    title,
    field,
    type,
    status,
    pageNum,
    pageSizeNum,
  );

  // 호출 결과 반환
  return res.status(200).json(userCompleteData);
}

async function getUserChallengeDetailInput(req, res) {
  // 입력값 불러오기
  const userID = !isUUID.v4(req.auth?.userId) ? undefined : req.auth?.userId;
  let { page, pageSize, title, field, type, status } = req.query;
  const pageNum = Number(page);
  const pageSizeNum = Number(pageSize);

  // 입력 검증
  if (!userID) {
    return res.status(400).json({
      success: false,
      message: "유저 ID가 없거나 올바르지 않습니다."
    });
  }
  if (title && title.trim() === '') {
    title = undefined;
  }
  if (field && !Object.values(ChallengeField).includes(field)) {
    return res.status(400).json({ message: '필드 값이 올바르지 않습니다.' });
  }
  if (type && !Object.values(ChallengeType).includes(type)) {
    return res.status(400).json({ message: '타입 값이 올바르지 않습니다.' });
  }
  if (status && !Object.values(ChallengeStatus).includes(status)) {
    return res.status(400).json({ message: '상태 값이 올바르지 않습니다.' });
  }
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
  return res.status(200).json(userChallengeDetailData);
}

export default {
  getChallengeListInput,
  getChallengeDetailInput,
  getParticipateListInput,
  getUserParticipateListInput,
  getUserCompleteListInput,
  getUserChallengeDetailInput,
};
