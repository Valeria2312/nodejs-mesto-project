import { Request, Response, NextFunction } from 'express';
import Card from '../models/card';
import BadRequestError from '../middleware/badRequestError';
import NotFoundError from '../middleware/notFoundError';
import { Code } from '../utils/codes';

export const getCards = (req: Request, res: Response, next: NextFunction) => Card.find({})
  .then((card) => res.status(Code.OK).send({ data: card }))
  .catch(next);

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const owner = req.body.user._id;

  if (!name || !link || !owner) {
    throw new BadRequestError('Переданы некорректные данные при создании карточки');
  }

  return Card.create({ name, link, owner })
    .then((card) => res.status(Code.OK).send({ data: card }))
    .catch(next);
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  Card.findByIdAndDelete({ cardId })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Данная карточка не найдена');
      } else {
        res.status(Code.OK).send({ data: card });
      }
    })
    .catch(next);
};

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.body._id } },
    { new: true },
  )
    .orFail()
    .then((card) => {
      res.status(Code.OK).send(card);
    })
    .catch(next);
};

export const dislikeCard = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.body._id } },
    { new: true },
  )
    .orFail()
    .then((card) => {
      res.status(Code.OK).send(card);
    })
    .catch(next);
};
