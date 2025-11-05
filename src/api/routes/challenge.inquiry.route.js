// 설명: API 라우트 정의하는 파일
import express from 'express';
import errorMiddleware from '../../middleware/error.middleware.js';
import authMiddleware from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validation.middleware.js';

import challengeControllers from '../controllers/challenge.inquiry.controller.js';
import {
  getChallengeListQuerySchema,
  challengeIdParamSchema,
  getParticipateListSchema,
} from '../../validators/challenge.validator.js';

const router = express.Router();

// 챌린지 목록 조회 - Zod 검증 적용
router.get(
  '/challenge-list',
  authMiddleware.verifyAccessToken,
  validate(getChallengeListQuerySchema),
  challengeControllers.getChallengeListInput,
);

// 챌린지 상세 조회 - Zod 검증 적용
router.get(
  '/challenge-detail/:challengeId',
  authMiddleware.verifyAccessToken,
  validate(challengeIdParamSchema),
  challengeControllers.getChallengeDetailInput,
);

// 참여자 목록 조회 - Zod 검증 적용
router.get(
  '/participate-list/:challengeId',
  authMiddleware.verifyAccessToken,
  validate(getParticipateListSchema),
  challengeControllers.getParticipateListInput,
);

// 내 참여 챌린지 목록 - Zod 검증 적용
router.get(
  '/individual-participate-list',
  authMiddleware.verifyAccessToken,
  validate(getChallengeListQuerySchema),
  challengeControllers.getUserParticipateListInput,
);

// 내 완료 챌린지 목록 - Zod 검증 적용
router.get(
  '/individual-complete-list',
  authMiddleware.verifyAccessToken,
  validate(getChallengeListQuerySchema),
  challengeControllers.getUserCompleteListInput,
);

// 내 챌린지 상세 - Zod 검증 적용
router.get(
  '/individual-challenge-detail',
  authMiddleware.verifyAccessToken,
  validate(getChallengeListQuerySchema),
  challengeControllers.getUserChallengeDetailInput,
);

// 에러 핸들링 미들웨어 적용
router.use(errorMiddleware.errorHandler);

export default router;
