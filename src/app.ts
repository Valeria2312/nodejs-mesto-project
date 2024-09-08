import express from 'express';
import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/mestodb');
const { PORT = 3000, BASE_PATH = 'none' } = process.env;

const app = express();

app.listen(PORT, () => {
  console.log('Ссылка на сервер');
  console.log(BASE_PATH);
});
