import express from "express";

import { 
  signupController,
  loginController,
  logoutController,
} from "../controllers/auth.conotroller.js";
import corsMiddleware from '../../common/cors.js';
import * as errorMiddleware from '../../common/error.js';

const router = express.Router();

router.use(corsMiddleware);

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: 사용자 인증 관련 API
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: 회원가입
 *     description: 새로운 사용자를 등록합니다.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@test.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               nickName:
 *                 type: string
 *                 example: "NewUser"
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *       409:
 *         description: 중복된 이메일
 */
router.post("/signup", signupController);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: 로그인
 *     description: 이메일과 비밀번호로 로그인하여 JWT 토큰을 발급받습니다.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@test.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: 로그인 성공 시 Access/Refresh 토큰 반환
 *       401:
 *         description: 인증 실패
 */
router.post("/login", loginController);


/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: 로그아웃
 *     description: 쿠키에 저장된 Refresh Token을 검증하고, 유효한 경우 해당 토큰을 무효화하여 로그아웃합니다.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: 로그아웃 성공
 *       401:
 *         description: Refresh Token이 없거나 유효하지 않음
 */
router.post("/logout", logoutController);

// 에러 핸들링 미들웨어 적용
router.use(errorMiddleware.errorHandler);

export default router;
