import express from "express";
import { 
  getWorkListController, 
  getSaveListController,
  getWorkDetailController,
  getSaveDetailController,
  createWorkController,
  createSaveWorkController,
  updateWorkController,
  deleteWorkController,
  toggleLikeController
} from "../controllers/challenge.inquiry.work.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: ChallengeWork
 *     description: 첼린지 작업물(Translated Work) 관련 API
 */

/**
 * @swagger
 * /api/challenge/inquiry/work/translated-list:
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
 *         description: 페이지 번호
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 페이지 크기
 *     responses:
 *       200:
 *         description: 작업물 리스트 반환 성공
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
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           attendId:
 *                             type: string
 *                             example: "123e4567-e89b-12d3-a456-426614174000"
 *                           nickName:
 *                             type: string
 *                             example: "참가자1"
 *                           role:
 *                             type: string
 *                             example: "USER"
 *                           likeCount:
 *                             type: integer
 *                             example: 12
 *                           createdAt:
 *                             type: string
 *                             example: "2025-10-29T12:00:00.000Z"
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page: { type: integer, example: 1 }
 *                         size: { type: integer, example: 10 }
 *                         total: { type: integer, example: 45 }
 *                         totalPages: { type: integer, example: 5 }
 */
router.get("/translated-list", getWorkListController);

/**
 * @swagger
 * /api/challenge/inquiry/work/translated-detail/{attend_id}:
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
 *         description: 참가자 참석 ID
 *     responses:
 *       200:
 *         description: 작업물 상세 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     attendId: { type: string, example: "abc123" }
 *                     title: { type: string, example: "나의 번역작품" }
 *                     workItem: { type: string, example: "번역된 문장 내용..." }
 *                     createdAt: { type: string, example: "2025-10-29T12:00:00.000Z" }
 *                     nickName: { type: string, example: "홍길동" }
 *                     role: { type: string, example: "USER" }
 *                     likeCount: { type: integer, example: 5 }
 *                     isClose: { type: boolean, example: false }
 */
router.get("/translated-detail/:attend_id", getWorkDetailController);

/**
 * @swagger
 * /api/challenge/inquiry/work/translated-list/save:
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 success: true
 *                 data:
 *                   items:
 *                     - attendId: "temp1"
 *                       title: "초안 제목"
 *                       createdAt: "2025-10-30T09:00:00Z"
 */
router.get("/translated-list/save", getSaveListController);

/**
 * @swagger
 * /api/challenge/inquiry/work/translated-detail/save/{attend_id}:
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
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 attendId: "temp1"
 *                 title: "초안 제목"
 *                 workItem: "작업물 초안 내용"
 */
router.get("/translated-detail/save/:attend_id", getSaveDetailController);

/**
 * @swagger
 * /api/challenge/inquiry/work/translated-detail:
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
 *             required: [challenge_id, title, workItem]
 *             properties:
 *               challenge_id: { type: string, example: "challenge123" }
 *               title: { type: string, example: "내 번역 작품" }
 *               workItem: { type: string, example: "본문 번역 내용..." }
 *     responses:
 *       201:
 *         description: 작업물 제출 성공
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "작업물이 제출되었습니다."
 */
router.post("/translated-detail", createWorkController);

/**
 * @swagger
 * /api/challenge/inquiry/work/translated-detail/save:
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
 *             required: [challenge_id, title, workItem]
 *             properties:
 *               challenge_id: { type: string, example: "challenge123" }
 *               title: { type: string, example: "임시 제목" }
 *               workItem: { type: string, example: "작성중인 내용..." }
 *     responses:
 *       200:
 *         description: 임시 저장 성공
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "임시 저장되었습니다."
 */
router.post("/translated-detail/save", createSaveWorkController);

/**
 * @swagger
 * /api/challenge/inquiry/work/translated-detail/{attend_id}:
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
 *               title: { type: string, example: "수정된 제목" }
 *               workItem: { type: string, example: "수정된 번역 내용..." }
 *     responses:
 *       200:
 *         description: 수정 성공
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "작업물이 수정되었습니다."
 */
router.patch("/translated-detail/:attend_id", updateWorkController);

/**
 * @swagger
 * /api/challenge/inquiry/work/translated-detail/{attend_id}:
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
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "작업물이 삭제되었습니다."
 */
router.delete("/translated-detail/:attend_id", deleteWorkController);

/**
 * @swagger
 * /api/challenge/inquiry/work/translated-detail/like/{attend_id}:
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
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "좋아요가 반영되었습니다."
 */
router.post("/translated-detail/like/:attend_id", toggleLikeController);

export default router;
