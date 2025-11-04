// 설명: API 라우트 정의하는 파일
import express from 'express';
import errorMiddleware from '../../middleware/error.middleware.js';
import authMiddleware from '../../middleware/auth.middleware.js';

import challengeControllers from '../controllers/challenge.inquiry.controller.js';

const router = express.Router();

router.get(
  '/challenge-list',
  authMiddleware.verifyAccessToken,
  challengeControllers.getChallengeListInput,
);

router.get(
  '/challenge-detail/:challengeId',
  authMiddleware.verifyAccessToken,
  challengeControllers.getChallengeDetailInput,
);

router.get(
  '/participate-list/:challengeId',
  authMiddleware.verifyAccessToken,
  challengeControllers.getParticipateListInput,
);

router.get(
  '/individual-participate-list',
  authMiddleware.verifyAccessToken,
  challengeControllers.getUserParticipateListInput,
);

router.get(
  '/individual-complete-list',
  authMiddleware.verifyAccessToken,
  challengeControllers.getUserCompleteListInput,
);

router.get(
  '/individual-challenge-detail',
  authMiddleware.verifyAccessToken,
  challengeControllers.getUserChallengeDetailInput,
);

// 에러 핸들링 미들웨어 적용
router.use(errorMiddleware.errorHandler);

export default router;
