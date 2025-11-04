import express from 'express';
import auth from '../../middleware/auth.middleware.js';
import { 
  getMyInfoController,
  updateUserProfileController,
  deleteUserProfileController
} from '../controllers/user.controller.js';

const router = express.Router();

router.get('/my', auth.verifyAccessToken, getMyInfoController);
router.patch("/my", auth.verifyAccessToken, updateUserProfileController);
router.delete("/my", auth.verifyAccessToken, deleteUserProfileController);

export default router;
