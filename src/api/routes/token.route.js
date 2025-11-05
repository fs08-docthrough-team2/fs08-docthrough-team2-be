import express from 'express';

import {
  verifyAccessTokenController,
  refreshTokenController,
} from '../controllers/token.controller.js';
import * as errorMiddleware from '../../middleware/error.middleware.js';

import auth from '../../middleware/auth.middleware.js';

const router = express.Router();

// Access Token 검증 - 쿠키/헤더에서 자동 검증 (추가 검증 불필요)
router.post('/verify', auth.verifyRefreshToken, verifyAccessTokenController);

// Access Token 갱신 - 쿠키에서 refreshToken 자동 추출 (추가 검증 불필요)
router.post('/refresh', refreshTokenController);

// 에러 핸들링 미들웨어 적용
router.use(errorMiddleware.errorHandler);

export default router;
