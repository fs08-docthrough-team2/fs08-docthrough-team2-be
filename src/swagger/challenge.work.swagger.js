/**
 * @swagger
 * tags:
 *   - name: ChallengeWork
 *     description: 첼린지 작업물(Translated Work) 관련 API
 */

/**
 * @swagger
 * /api/challenge/work/translated-list:
 *   get:
 *     summary: 제출된 작업물 리스트 조회
 *     description: 특정 첼린지에 제출된 모든 작업물 목록을 페이지네이션 형태로 반환합니다.
 *     tags: [ChallengeWork]
 *     parameters:
 *       - in: query
 *         name: challenge_id
 *         schema:
 *           type: string
 *         required: true
 *         description: 첼린지 ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: 작업물 리스트 반환 성공
 */

/**
 * @swagger
 * /api/challenge/work/translated-detail/{attend_id}:
 *   get:
 *     summary: 제출된 작업물 상세 조회
 *     description: 특정 참가자의 제출된 작업물 상세 정보를 조회합니다.
 *     tags: [ChallengeWork]
 *     parameters:
 *       - in: path
 *         name: attend_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 작업물 상세 조회 성공
 */

/**
 * @swagger
 * /api/challenge/work/translated-list/save:
 *   get:
 *     summary: 임시 저장된 작업물 리스트 조회
 *     description: 사용자가 임시로 저장한 작업물 리스트를 조회합니다.
 *     tags: [ChallengeWork]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           default: 5
 *     responses:
 *       200:
 *         description: 임시 저장 리스트 반환 성공
 */

/**
 * @swagger
 * /api/challenge/work/translated-detail/save/{attend_id}:
 *   get:
 *     summary: 임시 저장 상세 조회
 *     description: 특정 임시 저장 작업물의 상세 내용을 조회합니다.
 *     tags: [ChallengeWork]
 *     parameters:
 *       - in: path
 *         name: attend_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 임시 저장 상세 조회 성공
 */

/**
 * @swagger
 * /api/challenge/work/translated-detail:
 *   post:
 *     summary: 작업물 제출
 *     description: 사용자 작업물을 제출(저장)합니다.
 *     tags: [ChallengeWork]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [challengeId, title, workItem]
 *             properties:
 *               challengeId:
 *                 type: string
 *               title:
 *                 type: string
 *               workItem:
 *                 type: string
 *     responses:
 *       201:
 *         description: 작업물 제출 성공
 */

/**
 * @swagger
 * /api/challenge/work/translated-detail/save:
 *   post:
 *     summary: 작업물 임시 저장
 *     description: 작업물을 임시 저장합니다.
 *     tags: [ChallengeWork]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [challengeId, title, workItem]
 *             properties:
 *               challengeId:
 *                 type: string
 *               title:
 *                 type: string
 *               workItem:
 *                 type: string
 *     responses:
 *       200:
 *         description: 임시 저장 성공
 */

/**
 * @swagger
 * /api/challenge/work/translated-detail/{attend_id}:
 *   patch:
 *     summary: 작업물 수정
 *     description: 제출된 작업물의 제목 및 내용을 수정합니다.
 *     tags: [ChallengeWork]
 *     parameters:
 *       - in: path
 *         name: attend_id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, workItem]
 *             properties:
 *               title:
 *                 type: string
 *               workItem:
 *                 type: string
 *     responses:
 *       200:
 *         description: 수정 성공
 */

/**
 * @swagger
 * /api/challenge/work/translated-detail/{attend_id}:
 *   delete:
 *     summary: 작업물 삭제
 *     description: 제출된 작업물을 삭제합니다.
 *     tags: [ChallengeWork]
 *     parameters:
 *       - in: path
 *         name: attend_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 삭제 성공
 */

/**
 * @swagger
 * /api/challenge/work/translated-detail/like/{attend_id}:
 *   post:
 *     summary: 좋아요 토글
 *     description: 특정 작업물의 좋아요 상태를 토글합니다.
 *     tags: [ChallengeWork]
 *     parameters:
 *       - in: path
 *         name: attend_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 좋아요 상태 변경 성공
 */
