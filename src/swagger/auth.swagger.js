/**
 * @swagger
 * components:
 *   schemas:
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: object
 *           properties:
 *             code:
 *               type: string
 *               description: 에러 코드
 *             message:
 *               type: string
 *               description: 상세한 에러 메시지
 *             details:
 *               type: object
 *               description: 추가 에러 상세 정보 (선택적)
 */

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
 *             required:
 *               - email
 *               - password
 *               - nickName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: 이메일 주소
 *                 example: "newuser@example.com"
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 description: 비밀번호 (최소 8자, 영문+숫자 포함)
 *                 example: "newuser1234"
 *               nickName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 20
 *                 description: 닉네임 (2-20자, 한글/영문/숫자)
 *                 example: "새유저21"
 *     responses:
 *       201:
 *         description: 회원가입 성공 - 토큰 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: "uuid-string"
 *                     email:
 *                       type: string
 *                       example: "newuser@example.com"
 *                     nickName:
 *                       type: string
 *                       example: "새유저21"
 *                     role:
 *                       type: string
 *                       example: "USER"
 *                     accessToken:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIs..."
 *                     refreshToken:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIs..."
 *       400:
 *         description: 잘못된 요청 - 유효성 검증 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalidEmail:
 *                 summary: 이메일 형식 오류
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "VALIDATION_ERROR"
 *                     message: "이메일 형식이 올바르지 않습니다..."
 *               passwordTooShort:
 *                 summary: 비밀번호 길이 부족
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "VALIDATION_ERROR"
 *                     message: "비밀번호가 너무 짧습니다. 비밀번호는 최소 8자 이상이어야 합니다..."
 *       409:
 *         description: 중복 오류 - 이메일 또는 닉네임이 이미 사용 중
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               duplicateEmail:
 *                 summary: 이메일 중복
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "DUPLICATE_EMAIL"
 *                     message: "이메일 'newuser@example.com'은(는) 이미 등록되어 있습니다. 다른 이메일 주소를 사용하거나 로그인을 시도해주세요."
 *               duplicateNickname:
 *                 summary: 닉네임 중복
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "DUPLICATE_NICKNAME"
 *                     message: "닉네임 '새유저21'은(는) 이미 사용 중입니다. 다른 닉네임을 선택해주세요..."
 */

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
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: 이메일 주소
 *                 example: "admin@example.com"
 *               password:
 *                 type: string
 *                 description: 비밀번호
 *                 example: "admin1234"
 *     responses:
 *       200:
 *         description: 로그인 성공 - Access/Refresh 토큰 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: "uuid-string"
 *                     email:
 *                       type: string
 *                       example: "admin@example.com"
 *                     nickName:
 *                       type: string
 *                       example: "관리자"
 *                     role:
 *                       type: string
 *                       example: "ADMIN"
 *                     accessToken:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIs..."
 *                     refreshToken:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIs..."
 *       400:
 *         description: 잘못된 요청 - 유효성 검증 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: 인증 실패 - 사용자를 찾을 수 없거나 비밀번호가 틀림
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               userNotFound:
 *                 summary: 사용자 없음
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "USER_NOT_FOUND"
 *                     message: "이메일 'admin@example.com'로 등록된 사용자를 찾을 수 없습니다. 이메일 주소를 확인하거나 회원가입을 진행해주세요."
 *               invalidPassword:
 *                 summary: 비밀번호 틀림
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "INVALID_PASSWORD"
 *                     message: "입력하신 비밀번호가 올바르지 않습니다. 비밀번호는 대소문자를 구분하며, 등록 시 설정한 비밀번호와 정확히 일치해야 합니다..."
 */

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "로그아웃 완료"
 *       400:
 *         description: 잘못된 요청 - Refresh Token이 제공되지 않음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error:
 *                 code: "MISSING_REFRESH_TOKEN"
 *                 message: "Refresh Token이 제공되지 않았습니다. 로그아웃을 하려면 유효한 Refresh Token이 필요합니다..."
 *       401:
 *         description: 인증 실패 - Refresh Token이 유효하지 않음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error:
 *                 code: "INVALID_REFRESH_TOKEN"
 *                 message: "제공된 Refresh Token이 유효하지 않습니다. Token이 만료되었거나, 이미 로그아웃된 상태이거나, 잘못된 Token입니다..."
 */
