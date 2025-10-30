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
}
from "../controllers/challenge.inquiry.work.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: ChallengeWork
 *   description: 첼린지 작업물 관련 API
 */

/**
 * @swagger
 * /api/challenge/inquiry/work/traslated-list:
 *   get:
 *     summary: 제출된 작업물 리스트 조회
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
 *         description: 작업물 리스트 반환
 */
router.get("/work/traslated-list", getWorkListController);

/**
 * @swagger
 * /api/challenge/inquiry/work/trasleted-detail/{attend_id}:
 *   get:
 *     summary: 제출된 작업물 상세 조회
 *     tags: [ChallengeWork]
 *     parameters:
 *       - in: path
 *         name: attend_id
 *         schema:
 *           type: string
 *         required: true
 *         description: 작업물 ID
 *     responses:
 *       200:
 *         description: 작업물 상세 데이터 반환
 */
router.get("/work/trasleted-detail/:attend_id", getWorkDetailController);

/**
 * @swagger
 * /api/challenge/inquiry/work/traslated-list/save:
 *   get:
 *     summary: 임시 저장 리스트 조회
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
 *         description: 임시 저장 리스트 반환
 */
router.get("/work/traslated-list/save", getSaveListController);

/**
 * @swagger
 * /api/challenge/inquiry/work/trasleted-detail/save/{attend_id}:
 *   get:
 *     summary: 임시 저장 상세 조회
 *     tags: [ChallengeWork]
 *     parameters:
 *       - in: path
 *         name: attend_id
 *         schema:
 *           type: string
 *         required: true
 *         description: 임시 저장된 작업물 ID
 *     responses:
 *       200:
 *         description: 임시 저장 상세 반환
 */
router.get("/work/trasleted-detail/save/:attend_id", getSaveDetailController);

/**
 * @swagger
 * /api/challenge/inquiry/work/trasleted-detail:
 *   post:
 *     summary: 제출된 작업물 생성
 *     tags: [ChallengeWork]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - challenge_id
 *               - title
 *               - workItem
 *             properties:
 *               challenge_id:
 *                 type: string
 *                 description: 첼린지 ID
 *               title:
 *                 type: string
 *                 description: 작업물 제목
 *               workItem:
 *                 type: string
 *                 description: 작업물 내용
 *     responses:
 *       200:
 *         description: 제출된 작업물 생성 성공
 */
router.post("/work/trasleted-detail", createWorkController);

/**
 * @swagger
 * /api/challenge/inquiry/work/trasleted-detail/save:
 *   post:
 *     summary: 임시 저장 생성
 *     tags: [ChallengeWork]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - challenge_id
 *               - title
 *               - workItem
 *             properties:
 *               challenge_id:
 *                 type: string
 *                 description: 첼린지 ID
 *               title:
 *                 type: string
 *                 description: 작업물 제목
 *               workItem:
 *                 type: string
 *                 description: 작업물 내용
 *     responses:
 *       200:
 *         description: 임시 저장 생성 성공
 */
router.post("/work/trasleted-detail/save", createSaveWorkController);

/**
 * @swagger
 * /api/challenge/inquiry/work/trasleted-detail/{attend_id}:
 *   patch:
 *     summary: 작업물 수정
 *     tags: [ChallengeWork]
 *     parameters:
 *       - in: path
 *         name: attend_id
 *         schema:
 *           type: string
 *         required: true
 *         description: 작업물 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - workItem
 *             properties:
 *               title:
 *                 type: string
 *                 description: 수정할 제목
 *               workItem:
 *                 type: string
 *                 description: 수정할 내용
 *     responses:
 *       200:
 *         description: 작업물 수정 성공
 */
router.patch("/work/trasleted-detail/:attend_id", updateWorkController);

/**
 * @swagger
 * /api/challenge/inquiry/work/trasleted-detail/{attend_id}:
 *   delete:
 *     summary: 작업물 삭제
 *     tags: [ChallengeWork]
 *     parameters:
 *       - in: path
 *         name: attend_id
 *         schema:
 *           type: string
 *         required: true
 *         description: 작업물 ID
 *     responses:
 *       200:
 *         description: 작업물 삭제 성공
 */
router.delete("/work/trasleted-detail/:attend_id", deleteWorkController);

/**
 * @swagger
 * /api/challenge/inquiry/work/trasleted-detail/like/{attend_id}:
 *   post:
 *     summary: 좋아요 토글
 *     tags: [ChallengeWork]
 *     parameters:
 *       - in: path
 *         name: attend_id
 *         schema:
 *           type: string
 *         required: true
 *         description: 작업물 ID
 *     responses:
 *       200:
 *         description: 좋아요 상태 변경 성공
 */
router.post("/work/trasleted-detail/like/:attend_id", toggleLikeController);

export default router;