import { Router } from 'express';
import {
  getUser, getUsers, updateAvatar, updateProfile, getMe,
} from '../controllers/user';

const router = Router();
router.get('/users/me', getMe);
router.get('/', getUsers);
router.get('/:userId', getUser);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

export default router;
