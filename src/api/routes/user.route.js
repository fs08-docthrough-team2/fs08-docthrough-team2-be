import express from 'express';
import auth from '../../common/auth.js';
import { getMyInfoController } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/my', auth.verifyAccessToken, getMyInfoController);

export default router;
