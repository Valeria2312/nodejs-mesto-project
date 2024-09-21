import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { Code } from '../utils/codes';
import BadRequestError from '../middleware/badRequestError';
import NotFoundError from '../middleware/notFoundError';
import ErrorAuth from '../middleware/errorAuth';
import DuplicateEmail from '../middleware/errorDuplicateEmail';

export const getUsers = (req: Request, res: Response, next: NextFunction) => User.find({})
  .then((user) => res.status(Code.OK).send({ data: user }))
  .catch(next);

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email, password: hash, name, about, avatar,
    });
    return res.status(201).send({
      data: {
        _id: user._id,
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    if ((error as any).code === 11000) {
      return next(new DuplicateEmail('Пользователь с таким email уже существует'));
    }
    if (error instanceof Error && error.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
    }
    return next(error);
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.userId;
    const user = await User.findById(id);
    if (!user) {
      return next(new NotFoundError('Передан некорректный _id пользователя.'));
    }
    return res.send({ data: user });
  } catch (error) {
    return next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, about } = req.body;
    if (!name || !about) {
      return next(new BadRequestError('Переданы некорректные данные при изменении данных пользователя'));
    }
    // @ts-expect-error
    const id = req.user._id;
    // eslint-disable-next-line max-len
    const user = await User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true });
    if (!user) {
      return next(new NotFoundError('Передан некорректный _id пользователя.'));
    }
    return res.status(Code.OK).send(user);
  } catch (error) {
    return next(error);
  }
};

export const updateAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { avatar } = req.body;
    if (!avatar) {
      return next(new BadRequestError('Переданы некорректные данные при изменении аватара пользователя'));
    }
    // @ts-expect-error
    const id = req.user._id;
    const user = await User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true });
    return res.status(Code.OK).send(user);
  } catch (error) {
    return next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new ErrorAuth('Неправильные почта или пароль'));
    }

    const isMatched = bcrypt.compare(password, user.password);
    if (!isMatched) {
      return next(new ErrorAuth('Неправильные почта или пароль'));
    }

    const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
    res.cookie('jwt', token, {
      maxAge: 7 * 24 * 60 * 60,
      httpOnly: true,
    });
    return res.send({ data: token });
  } catch (error) {
    return next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.userId;
    const user = await User.findById(id);
    if (!user) {
      return next(new BadRequestError('Пользователь с данным id не найден'));
    }
    return res.status(Code.OK).send({ data: user });
  } catch (error) { return next(error); }
};
