// routes/challenge.admin.routes.js
import express from 'express';
import errorMiddleware from '../../common/error.js';
import authMiddleware from '../../common/auth.js';

import challengeAdminControllers from '../controllers/challenge.admin.controllers.js';

const router = express.Router();

router.get(
  '/inquiry/challenge-list',
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  challengeAdminControllers.getChallengeListInput,
);

router.get(
  '/inquiry/challenge/:challengeId',
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  challengeAdminControllers.getChallengeDetailInput,
);

router.patch(
  '/new-challenge/approve/:challengeId',
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  challengeAdminControllers.approveChallengeInput,
);

router.patch(
  '/new-challenge/reject/:challengeId',
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  challengeAdminControllers.rejectChallengeInput,
);

// 에러 핸들링 미들웨어 적용
router.use(errorMiddleware.errorHandler);

export default router;
