// routes/challenge.admin.routes.js
import express from 'express';
import errorMiddleware from '../../middleware/error.middleware.js';
import authMiddleware from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validation.middleware.js';

import challengeAdminControllers from '../controllers/challenge.admin.controller.js';
import {
  getChallengeListQuerySchema,
  challengeIdParamSchema,
  rejectChallengeSchema,
} from '../../validators/challenge.validator.js';

const router = express.Router();

// 챌린지 목록 조회 - Zod 검증 적용
router.get(
  '/inquiry/challenge-list',
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  validate(getChallengeListQuerySchema),
  challengeAdminControllers.getChallengeListInput,
);

// 챌린지 상세 조회 - Zod 검증 적용
router.get(
  '/inquiry/challenge/:challengeId',
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  validate(challengeIdParamSchema),
  challengeAdminControllers.getChallengeDetailInput,
);

// 챌린지 승인 - Zod 검증 적용
router.patch(
  '/new-challenge/approve/:challengeId',
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  validate(challengeIdParamSchema),
  challengeAdminControllers.approveChallengeInput,
);

// 챌린지 거절 - Zod 검증 적용 (거절 사유 필수)
router.patch(
  '/new-challenge/reject/:challengeId',
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  validate(rejectChallengeSchema),
  challengeAdminControllers.rejectChallengeInput,
);

// 에러 핸들링 미들웨어 적용
router.use(errorMiddleware.errorHandler);

export default router;
