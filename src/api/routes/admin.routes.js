import express from "express";
import auth from "../../common/auth.js";
import {
  getAllUsersController,
  getUserByEmailController,
  updateUserRoleByEmailController,
}
from "../controllers/admin.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: 관리자 전용 API
 */
const { verifyAccessToken, verifyAdmin } = auth;
router.use(verifyAccessToken, verifyAdmin);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: 전체 사용자 목록 조회 (페이지네이션 + 검색)
 *     description: 관리자 전용 API로, email 또는 nick_name으로 검색 가능
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: test
 *     responses:
 *       200:
 *         description: 사용자 목록 반환
 */
router.get("/users", getAllUsersController);

/**
 * @swagger
 * /api/admin/users/{email}:
 *   get:
 *     summary: 이메일 기준 사용자 조회
 *     description: 특정 사용자의 상세 정보를 이메일로 조회 (관리자 전용)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           example: user@test.com
 *     responses:
 *       200:
 *         description: 사용자 정보 반환
 */
router.get("/users/:email", getUserByEmailController);

/**
 * @swagger
 * /api/admin/users/{email}/role:
 *   patch:
 *     summary: 이메일 기준 사용자 역할 변경
 *     description: 사용자 역할(USER / EXPERT / ADMIN)을 변경 (관리자 전용)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           example: user@test.com
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [USER, EXPERT, ADMIN]
 *                 example: EXPERT
 *     responses:
 *       200:
 *         description: 역할 변경 성공
 *       400:
 *         description: 잘못된 역할 값
 */
router.patch("/users/:email/role", updateUserRoleByEmailController);

export default router;