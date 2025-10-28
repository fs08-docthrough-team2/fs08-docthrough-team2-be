// 설명: API 라우트 정의하는 파일
import express from 'express';
import corsMiddleware from '../../common/cors.js';
import errorMiddleware from '../../common/error.js';
import challengeAdminControllers from '../controllers/challenge.admin.controllers.js';

const router = express.Router();
router.use(corsMiddleware);

router.get('/inquiry/challenge-list', challengeAdminControllers.getChallengeListInput);
router.get('/inquiry/challenge/:challengeId', challengeAdminControllers.getChallengeDetailInput);
router.patch('/new-challenge/approve/:challengeId', challengeAdminControllers.approveChallengeInput);
router.patch('/new-challenge/reject/:challengeId', challengeAdminControllers.rejectChallengeInput);

// 에러 핸들링 미들웨어 적용
router.use(errorMiddleware.errorHandler);

export default router;
