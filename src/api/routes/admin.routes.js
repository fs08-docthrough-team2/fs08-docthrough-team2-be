import express from 'express';
import auth from '../../common/auth.js';
import {
  getAllUsersController,
  getUserByEmailController,
  updateUserRoleByEmailController,
} from '../controllers/admin.controller.js';

const router = express.Router();

const { verifyAccessToken, verifyAdmin } = auth;
router.use(verifyAccessToken, verifyAdmin);

router.get('/users', getAllUsersController);
router.get('/users/:email', getUserByEmailController);
router.patch('/users/:email/role', updateUserRoleByEmailController);

export default router;
