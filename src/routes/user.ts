import { Router } from 'express';
import {
  createUser, getUser, getUsers, updateAvatar, updateProfile,
} from '../controllers/user';

const router = Router();

router.get('/', getUsers);
router.get('/:userId', getUser);
router.post('/', createUser);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

export default router;
