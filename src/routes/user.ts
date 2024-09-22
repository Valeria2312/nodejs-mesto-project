import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getUser, getUsers, updateAvatar, updateProfile, getMe,
} from '../controllers/user';
import { urlRegex } from '../utils/consts';

const router = Router();
router.get('/me', getMe);
router.get('/', getUsers);
router.get('/:userId', celebrate({ params: Joi.object().keys({ userId: Joi.string().length(24) }) }), getUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(200).required(),
  }),
}), updateProfile);
router.patch('/me/avatar', celebrate({ body: Joi.object().keys({ avatar: Joi.string().pattern(urlRegex).required() }) }), updateAvatar);

export default router;
