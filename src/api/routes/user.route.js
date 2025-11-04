import express from 'express';
import auth from '../../middleware/auth.middleware.js';
import { getMyInfoController } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/my', auth.verifyAccessToken, getMyInfoController);

export default router;
