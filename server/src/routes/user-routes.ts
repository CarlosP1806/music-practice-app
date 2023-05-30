import express from 'express';
import authMiddleware from '../utils/auth';
import {
  getCurrentUser,
  createUser,
  login,
  logout
} from '../controllers/user-controllers';

const router = express.Router();
router.route('/').post(createUser);
router.route('/login').post(login);
router.route('/logout').post(logout);
router.route('/me').get(authMiddleware, getCurrentUser);

export default router;
