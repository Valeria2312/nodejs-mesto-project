import { Request, Response } from 'express';
import User from '../models/user';
import { Code } from '../utils/errors';

export const getUsers = (req: Request, res: Response) => User.find({})
  .then((user) => res.send({ data: user }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  if (!name || !about || !avatar) {
    return res.status(Code.IncorrectData).send({ message: 'Переданы некорректные данные при создании пользователя' });
  }
  return User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

export const getUser = (req: Request, res: Response) => {
  const id = req.params.userId;
  return User.findById(id)
    .orFail()
    .then((users) => res.send({ data: users }))
    .catch((err) => { console.log(err); });
};

export const updateProfile = (req: Request, res: Response) => {
  const { name, about } = req.body;
  // @ts-expect-error
  const id = req.user._id;

  return User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      res.status(Code.OK).send(user);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const updateAvatar = (req: Request, res: Response) => {
  const { avatar } = req.body;
  // @ts-expect-error
  const id = req.user._id;

  return User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      res.status(Code.OK).send(user);
    })
    .catch((err) => {
      console.log(err);
    });
};
