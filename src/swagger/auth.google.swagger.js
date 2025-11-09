/**
 * @swagger
 * /api/auth/google/login:
 *   get:
 *     summary: Google 로그인 (Swagger에서는 실행되지 않습니다)
 *     description: >
 *       Google OAuth 로그인 페이지로 이동합니다. Swagger에서는 실행되지 않으므로 브라우저에서 직접 테스트해야 합니다.
 *       테스트 URL: http://localhost:3000/api/auth/google/login
 *     tags:
 *       - Auth
 *     responses:
 *       302:
 *         description: Google 로그인 페이지로 리다이렉트
 */

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Google 로그인 콜백 (Swagger에서는 실행되지 않습니다)
 *     description: >
 *       Google 로그인 성공 후 호출되는 콜백 엔드포인트입니다. Swagger에서는 실행되지 않습니다. 브라우저에서 직접 테스트해야 합니다.
 *       테스트 URL: http://localhost:3000/api/auth/google/callback
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: 로그인 성공 시 사용자 정보와 JWT 토큰 반환
 *       401:
 *         description: 로그인 실패
 */
