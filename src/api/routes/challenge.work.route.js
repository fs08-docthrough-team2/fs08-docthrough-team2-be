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

const router = express.Router();

router.get('/translated-list', getWorkListController);
router.get('/translated-detail/:attend_id', getWorkDetailController);
router.get('/translated-list/save', getSaveListController);
router.get('/translated-detail/save/:attend_id', getSaveDetailController);
router.post('/translated-detail', createWorkController);
router.post('/translated-detail/save', createSaveWorkController);
router.patch('/translated-detail/:attend_id', updateWorkController);
router.delete('/translated-detail/:attend_id', deleteWorkController);
router.post('/translated-detail/like/:attend_id', toggleLikeController);

export default router;
