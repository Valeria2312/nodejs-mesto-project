import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} from '../controllers/card';

const router = Router();

router.get('/', getCards);
router.delete('/:cardId', celebrate({ params: Joi.object().keys({ cardId: Joi.string().length(24) }) }), deleteCard);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().uri(),
  }),
}), createCard);
router.put('/:cardId/likes', celebrate({ params: Joi.object().keys({ cardId: Joi.string().length(24) }) }), likeCard);
router.delete('/:cardId/likes', celebrate({ params: Joi.object().keys({ cardId: Joi.string().length(24) }) }), dislikeCard);

export default router;
