// 설명: API 라우트 정의하는 파일
import express from 'express';
import errorMiddleware from '../../middleware/error.middleware.js';
import authMiddleware from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validation.middleware.js';

import challengeCRUDControllers from '../controllers/challenge.crud.controller.js';
import {
  createChallengeSchema,
  updateChallengeSchema,
  challengeIdParamSchema,
} from '../../validators/challenge.validator.js';

const router = express.Router();

// 챌린지 생성 - Zod 검증 적용 (SQL 인젝션, XSS 방지)
router.post(
  '/create',
  authMiddleware.verifyAccessToken,
  validate(createChallengeSchema),
  challengeCRUDControllers.createChallengeInput,
);

// 챌린지 수정 - Zod 검증 적용
router.patch(
  '/update/:challengeId',
  authMiddleware.verifyAccessToken,
  validate(updateChallengeSchema),
  challengeCRUDControllers.updateChallengeInput,
);

// 챌린지 취소 - Zod 검증 적용
router.patch(
  '/cancel/:challengeId',
  authMiddleware.verifyAccessToken,
  validate(challengeIdParamSchema),
  challengeCRUDControllers.cancelChallengeInput,
);

// 챌린지 삭제 - Zod 검증 적용
router.patch(
  '/delete/:challengeId',
  authMiddleware.verifyAccessToken,
  validate(challengeIdParamSchema),
  challengeCRUDControllers.deleteChallengeInput,
);

// 챌린지 완전 삭제 - Zod 검증 적용
router.delete(
  '/hard-delete/:challengeId',
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  validate(challengeIdParamSchema),
  challengeCRUDControllers.hardDeleteChallengeInput,
);

// 에러 핸들링 미들웨어 적용
router.use(errorMiddleware.errorHandler);

export default router;
