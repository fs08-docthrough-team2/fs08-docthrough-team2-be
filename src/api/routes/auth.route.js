import express from 'express';

import {
  signupController,
  loginController,
  logoutController,
} from '../controllers/auth.controller.js';
import * as errorMiddleware from '../../common/error.js';

const router = express.Router();

router.post('/signup', signupController);
router.post('/login', loginController);
router.post('/logout', logoutController);

// 에러 핸들링 미들웨어 적용
router.use(errorMiddleware.errorHandler);

export default router;
