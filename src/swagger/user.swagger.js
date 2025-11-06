/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: JWT 액세스 토큰을 입력하세요
 */

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
 *     security:
 *       - BearerAuth: []
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

/**
 * @swagger
 * /api/user/my:
 *   patch:
 *     summary: 내 정보 수정
 *     description: 로그인한 유저가 닉네임 또는 비밀번호를 수정합니다.
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nickName:
 *                 type: string
 *                 example: "새닉네임"
 *               password:
 *                 type: string
 *                 example: "newpassword1234"
 *     responses:
 *       200:
 *         description: 수정 완료
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증 실패
 *   delete:
 *     summary: 회원 탈퇴 (논리적 삭제)
 *     description: 로그인한 유저의 계정을 논리적으로 삭제합니다.
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 탈퇴 완료
 *       401:
 *         description: 인증 실패
 */
