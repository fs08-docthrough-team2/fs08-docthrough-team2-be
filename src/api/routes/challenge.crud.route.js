// 설명: API 라우트 정의하는 파일
import express from 'express';
import errorMiddleware from '../../middleware/error.middleware.js';
import authMiddleware from '../../middleware/auth.middleware.js';

import challengeCRUDControllers from '../controllers/challenge.crud.controllers.js';

const router = express.Router();

router.post(
  '/create',
  authMiddleware.verifyAccessToken,
  challengeCRUDControllers.createChallengeInput,
);

router.patch(
  '/update/:challengeId',
  authMiddleware.verifyAccessToken,
  challengeCRUDControllers.updateChallengeInput,
);

router.patch(
  '/cancel/:challengeId',
  authMiddleware.verifyAccessToken,
  challengeCRUDControllers.cancelChallengeInput,
);

router.patch(
  '/delete/:challengeId',
  authMiddleware.verifyAccessToken,
  challengeCRUDControllers.deleteChallengeInput,
);

router.delete(
  '/hard-delete/:challengeId',
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  challengeCRUDControllers.hardDeleteChallengeInput,
);

// 에러 핸들링 미들웨어 적용
router.use(errorMiddleware.errorHandler);

export default router;
