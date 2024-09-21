import express from 'express';
import mongoose from 'mongoose';
import { celebrate, Joi, errors } from 'celebrate';
import usersRoutes from './routes/user';
import cardsRoutes from './routes/card';
import errorHandler from './middleware/errorHandler';
import auth from './middleware/auth';
import { createUser, login } from './controllers/user';
import { requestLogger, errorLogger } from './middleware/logger';
import error from './middleware/errors';
import urlRegex from './utils/consts';

const { PORT = 3000, DB_ADDRESS = 'mongodb://localhost:27017/mestodb' } = process.env;

mongoose.connect(DB_ADDRESS);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(urlRegex),
  }),
}), createUser);

app.use(auth);

app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);

app.use(errorLogger);

app.use(errorHandler);
app.use(errors());
app.use(error);

app.listen(PORT, () => {});
