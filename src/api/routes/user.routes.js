import express from 'express';
import auth from '../../common/auth.js';
import { getMyInfoController } from '../controllers/user.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: 사용자 관련 API
 */

/**
 * @swagger
 * /api/user/my:
 *   get:
 *     summary: 내 정보 조회
 *     description: Authorization 헤더의 Access Token을 이용해 현재 로그인한 유저의 정보를 조회합니다.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: 성공적으로 유저 정보 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nickName:
 *                   type: string
 *                   example: "유저2"
 *                 role:
 *                   type: string
 *                   example: "USER"
 *       401:
 *         description: 인증 실패
 */
router.get('/my', auth.verifyAccessToken, getMyInfoController);

export default router;
