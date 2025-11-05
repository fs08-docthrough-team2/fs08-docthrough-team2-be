import express from 'express';

import {
  signupController,
  loginController,
  logoutController,
} from '../controllers/auth.controller.js';
import * as errorMiddleware from '../../middleware/error.middleware.js';
import { validate } from '../../middleware/validation.middleware.js';
import { signupSchema, loginSchema } from '../../validators/auth.validator.js';

const router = express.Router();

// 회원가입 - Zod 검증 적용 (SQL 인젝션, XSS 방지, 비밀번호 강도 검증)
router.post('/signup', validate(signupSchema), signupController);

// 로그인 - Zod 검증 적용
router.post('/login', validate(loginSchema), loginController);

// 로그아웃
router.post('/logout', logoutController);

// 에러 핸들링 미들웨어 적용
router.use(errorMiddleware.errorHandler);

export default router;
