import express from 'express';

const { PORT = 3000, BASE_PATH = 'none' } = process.env;

const app = express();

app.listen(PORT, () => {
  console.log('Ссылка на сервер');
  console.log(BASE_PATH);
});
