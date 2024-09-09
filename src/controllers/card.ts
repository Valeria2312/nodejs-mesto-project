import { Request, Response } from 'express';
import Card from '../models/card';
import { Code } from '../utils/errors';

export const getCards = (req: Request, res: Response) => Card.find({})
  .then((card) => res.send({ data: card }))
  .catch((err) => { console.log(err); });

export const createCard = (req: Request, res: Response) => {
  const owner = req.body.user._id;
  const { name, link } = req.body;

  if (!name || !link || !owner) {
    return res.status(Code.IncorrectData).send({ message: 'Переданы некорректные данные при создании карточки' });
  }

  return Card.create({ name, link, owner })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => console.log(err));
};

export const deleteCard = (req: Request, res: Response) => {
  const { cardId } = req.params;
  Card.findByIdAndDelete({ cardId })
    .then((card) => {
      if (!card) {
        console.log('Данная карточка не найдена');
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => console.log(err));
};

export const likeCard = (req: Request, res: Response) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.body._id } },
    { new: true },
  )
    .orFail()
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const dislikeCard = (req: Request, res: Response) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.body._id } },
    { new: true },
  )
    .orFail()
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => console.log(err));
};
