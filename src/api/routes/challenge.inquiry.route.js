// 설명: API 라우트 정의하는 파일
import express from 'express';
import corsMiddleware from '../../common/cors.js';
import errorMiddleware from '../../common/error.js';

import challengeControllers from '../controllers/challenge.inquiry.controllers.js';

const router = express.Router();
router.use(corsMiddleware);

router.get('/challenge-list', challengeControllers.getChallengeListInput);

// 에러 핸들링 미들웨어 적용
router.use(errorMiddleware.errorHandler);

export default router;
