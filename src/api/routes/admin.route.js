import express from 'express';
import auth from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validation.middleware.js';
import {
  getAllUsersController,
  getUserByEmailController,
  updateUserRoleByEmailController,
} from '../controllers/admin.controller.js';
import {
  getUsersQuerySchema,
  emailParamSchema,
  updateUserRoleSchema,
} from '../../validators/admin.validator.js';

const router = express.Router();

const { verifyAccessToken, verifyAdmin } = auth;
router.use(verifyAccessToken, verifyAdmin);

// 모든 사용자 조회 - Zod 검증 적용 (검색어 SQL 인젝션 방지)
router.get('/users', validate(getUsersQuerySchema), getAllUsersController);

// 이메일로 사용자 조회 - Zod 검증 적용 (이메일 형식 검증)
router.get('/users/:email', validate(emailParamSchema), getUserByEmailController);

// 사용자 역할 변경 - Zod 검증 적용 (역할 enum 검증)
router.patch('/users/:email/role', validate(updateUserRoleSchema), updateUserRoleByEmailController);

export default router;
