import express from "express";

import { 
  verifyAccessTokenController,
  refreshTokenController,
} from "../controllers/token.controller.js";
import corsMiddleware from '../../common/cors.js';
import * as errorMiddleware from '../../common/error.js';

import auth from "../../common/auth.js";

const router = express.Router();

router.use(corsMiddleware);
/**
 * @swagger
 * tags:
 *   name: Token
 *   description: JWT 토큰 관련 API
 */

/**
 * @swagger
 * /api/token/verify:
 *   post:
 *     summary: Refresh Token 유효성 검증
 *     description: 쿠키에 저장된 Refresh Token을 검증하여 사용자가 유효한지 확인합니다.
 *     tags: [Token]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Refresh Token이 유효한 경우 사용자 정보 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Refresh Token 유효함"
 *                 user:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: "uuid"
 *                     email:
 *                       type: string
 *                       example: "user@test.com"
 *                     nickName:
 *                       type: string
 *                       example: "tester"
 *       401:
 *         description: Refresh Token이 없거나 유효하지 않음
 */
router.post("/verify", auth.verifyRefreshToken, verifyAccessTokenController);

/**
 * @swagger
 * /api/token/refresh:
 *   post:
 *     summary: Refresh Token으로 Access Token 재발급
 *     description: 쿠키에 저장된 Refresh Token을 사용하여 새로운 Access Token을 발급받습니다.
 *     tags: [Token]
 *     responses:
 *       200:
 *         description: 새 Access/Refresh 토큰 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: "new.jwt.access.token"
 *                 refreshToken:
 *                   type: string
 *                   example: "new.jwt.refresh.token"
 *       401:
 *         description: Refresh Token이 없거나 만료됨
 */
router.post("/refresh", refreshTokenController);

// 에러 핸들링 미들웨어 적용
router.use(errorMiddleware.errorHandler);

export default router;
