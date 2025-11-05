import express from 'express';
import auth from '../test_doc/fs08-docthrough-team2-be/src/middleware/auth.middleware.js';
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
