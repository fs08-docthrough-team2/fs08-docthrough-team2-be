// 설명: API 라우트 정의하는 파일
import express from 'express';
import corsMiddleware from '../../common/cors.js';
import errorMiddleware from '../../common/error.js';

import noticeControllers from '../controllers/notice.controllers.js';
import authMiddleware from '../../common/auth.js';

const router = express.Router();
router.use(corsMiddleware);

router.post(
  '/add-mark-read/:noticeId',
  authMiddleware.verifyAccessToken,
  noticeControllers.addMarkNoticeAsReadInput
);
router.get(
  '/get-list',
  authMiddleware.verifyAccessToken,
  noticeControllers.getUserNoticeInput
);

// 에러 핸들링 미들웨어 적용
router.use(errorMiddleware.errorHandler);

export default router;
