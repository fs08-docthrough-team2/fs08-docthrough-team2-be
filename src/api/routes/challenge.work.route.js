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
router.get('/translated-detail/:attendId', getWorkDetailController);
router.get('/translated-list/save', getSaveListController);
router.get('/translated-detail/save/:attendId', getSaveDetailController);
router.post('/translated-detail', createWorkController);
router.post('/translated-detail/save', createSaveWorkController);
router.patch('/translated-detail/:attendId', updateWorkController);
router.delete('/translated-detail/:attendId', deleteWorkController);
router.post('/translated-detail/like/:attendId', toggleLikeController);

export default router;