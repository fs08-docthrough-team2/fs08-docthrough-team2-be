import express from 'express';

import {
  verifyAccessTokenController,
  refreshTokenController,
} from '../controllers/token.controller.js';
import * as errorMiddleware from '../../common/error.js';

import auth from '../../common/auth.js';

const router = express.Router();

router.post('/verify', auth.verifyRefreshToken, verifyAccessTokenController);
router.post('/refresh', refreshTokenController);

// 에러 핸들링 미들웨어 적용
router.use(errorMiddleware.errorHandler);

export default router;
