// 설명: API 라우트 정의하는 파일
import express from 'express';
import errorMiddleware from '../../middleware/error.middleware.js';
import { validate } from '../../middleware/validation.middleware.js';

import noticeControllers from '../controllers/notice.controller.js';
import authMiddleware from '../../middleware/auth.middleware.js';
import {
  noticeIdParamSchema,
  getNoticeListQuerySchema,
} from '../../validators/notice.validator.js';

const router = express.Router();

// 알림 읽음 표시 - Zod 검증 적용 (UUID 형식 검증)
router.post(
  '/add-mark-read/:noticeId',
  authMiddleware.verifyAccessToken,
  validate(noticeIdParamSchema),
  noticeControllers.addMarkNoticeAsReadInput,
);

// 알림 목록 조회 - Zod 검증 적용 (페이지네이션 검증)
router.get(
  '/get-list',
  authMiddleware.verifyAccessToken,
  validate(getNoticeListQuerySchema),
  noticeControllers.getUserNoticeInput
);

// 에러 핸들링 미들웨어 적용
router.use(errorMiddleware.errorHandler);

export default router;
