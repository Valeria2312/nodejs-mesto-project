import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import usersRoutes from './routes/user';
import cardsRoutes from './routes/card';
import errorHandler from './middleware/errorHandler';

mongoose.connect('mongodb://localhost:27017/mestodb');
const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
  // @ts-expect-error
  req.user = {
    _id: '66df533ad7fab22f515969f9',
  };
  next();
});

app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);

app.use(errorHandler);

app.listen(PORT, () => {});
