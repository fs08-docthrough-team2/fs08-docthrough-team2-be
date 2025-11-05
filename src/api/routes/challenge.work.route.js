import express from 'express';
import {
  getWorkListController,
  getSaveListController,
  getWorkDetailController,
  getSaveDetailController,
  createWorkController,
  createSaveWorkController,
  updateWorkController,
  deleteWorkController,
  toggleLikeController,
} from '../controllers/challenge.work.controller.js';
import { validate } from '../../middleware/validation.middleware.js';
import {
  createWorkSchema,
  updateWorkSchema,
  getWorkListQuerySchema,
} from '../../validators/work.validator.js';

const router = express.Router();

// 작업물 조회 - Zod 검증 적용
router.get('/translated-list', validate(getWorkListQuerySchema), getWorkListController);
router.get('/translated-detail/:attend_id', getWorkDetailController);

// 임시 저장 조회 - Zod 검증 적용
router.get('/translated-list/save', validate(getWorkListQuerySchema), getSaveListController);
router.get('/translated-detail/save/:attend_id', getSaveDetailController);

// 작업물 생성 - Zod 검증 적용 (SQL 인젝션, XSS 방지)
router.post('/translated-detail', validate(createWorkSchema), createWorkController);
router.post('/translated-detail/save', validate(createWorkSchema), createSaveWorkController);

// 작업물 수정 - Zod 검증 적용
router.patch('/translated-detail/:attend_id', validate(updateWorkSchema), updateWorkController);

// 작업물 삭제
router.delete('/translated-detail/:attend_id', deleteWorkController);

// 좋아요 토글
router.post('/translated-detail/like/:attend_id', toggleLikeController);

export default router;
