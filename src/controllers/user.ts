import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import { Code } from '../utils/codes';
import BadRequestError from '../middleware/badRequestError';
import NotFoundError from '../middleware/notFoundError';

export const getUsers = (req: Request, res: Response, next: NextFunction) => User.find({})
  .then((user) => res.status(Code.OK).send({ data: user }))
  .catch(next);

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;

  if (!name || !about || !avatar) {
    throw new BadRequestError('Переданы некорректные данные при создании пользователя');
  }

  return User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch(next);
};

export const getUser = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.userId;
  return User.findById(id)
    .orFail(() => {
      throw new NotFoundError('Передан некорректный _id пользователя.');
    })
    .then((users) => res.send({ data: users }))
    .catch(next);
};

export const updateProfile = (req: Request, res: Response, next: NextFunction) => {
  const { name, about } = req.body;

  if (!name || !about) {
    throw new BadRequestError('Переданы некорректные данные при изменении данных пользователя');
  }
  // @ts-expect-error
  const id = req.user._id;

  return User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError('Передан некорректный _id пользователя.');
    })
    .then((user) => {
      res.status(Code.OK).send(user);
    })
    .catch(next);
};

export const updateAvatar = (req: Request, res: Response, next: NextFunction) => {
  const { avatar } = req.body;

  if (!avatar) {
    throw new BadRequestError('Переданы некорректные данные при изменении аватара пользователя');
  }
  // @ts-expect-error
  const id = req.user._id;

  return User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      res.status(Code.OK).send(user);
    })
    .catch(next);
};
