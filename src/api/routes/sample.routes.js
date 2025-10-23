// 설명: API 라우트 정의하는 파일
import express from 'express';
import corsMiddleware from '../../common/cors.js';
import errorMiddleware from '../../common/error.js';

import sampleControllers from '../controllers/sample.controllers.js';

const router = express.Router();
router.use(corsMiddleware);

router.get('/samples', sampleControllers.getSamples);

// 에러 핸들링 미들웨어 적용
router.use(errorMiddleware.errorHandler);

export default router;
