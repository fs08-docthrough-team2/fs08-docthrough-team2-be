import express from 'express';
import auth from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validation.middleware.js';
import {
  getMyInfoController,
  updateUserProfileController,
  deleteUserProfileController
} from '../controllers/user.controller.js';
import { updateUserProfileSchema } from '../../validators/user.validator.js';

const router = express.Router();

// 내 정보 조회
router.get('/my', auth.verifyAccessToken, getMyInfoController);

// 내 정보 수정 - Zod 검증 적용 (닉네임, 비밀번호 강도 검증)
router.patch("/my", auth.verifyAccessToken, validate(updateUserProfileSchema), updateUserProfileController);

// 회원 탈퇴
router.delete("/my", auth.verifyAccessToken, deleteUserProfileController);

export default router;
