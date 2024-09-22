import { Request, Response, NextFunction } from 'express';
import Card from '../models/card';
import BadRequestError from '../middleware/badRequestError';
import NotFoundError from '../middleware/notFoundError';
import { Code } from '../utils/codes';
import Forbidden from '../middleware/errorForbidden';

export const getCards = (req: Request, res: Response, next: NextFunction) => Card.find({})
  .then((card) => res.status(Code.OK).send({ data: card }))
  .catch(next);

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  // @ts-expect-error
  const owner = req.user._id;

  if (!name || !link || !owner) {
    return next(new BadRequestError('Переданы некорректные данные при создании карточки'));
  }

  return Card.create({ name, link, owner })
    .then((card) => res.status(Code.OK).send({ data: card }))
    .catch(next);
};

export const deleteCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);
    if (!card) {
      return next(new NotFoundError('Данная карточка не найдена'));
    }
    if (req.params.userId !== card.owner.toString()) {
      return next(new Forbidden('Недостаточно прав'));
    }
    return Card.findByIdAndDelete(req.params.cardId)
      .then(() => res.send({ message: 'Карточка удалена' }));
  } catch (error) { return next(error); }
};

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  // @ts-expect-error
  const owner = req.user._id;

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: owner } },
    { new: true },
  )
    .orFail()
    .then((card) => {
      res.status(Code.OK).send(card);
    })
    .catch(next);
};

export const dislikeCard = (req: Request, res: Response, next: NextFunction) => {
  // @ts-expect-error
  const owner = req.user._id;

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: owner } },
    { new: true },
  )
    .orFail()
    .then((card) => {
      res.status(Code.OK).send(card);
    })
    .catch(next);
};
