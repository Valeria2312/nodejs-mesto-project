import { Request, Response } from 'express';

interface IError extends Error {
  statusCode?: number
}

export default (error: IError, req: Request, res: Response) => {
  const { statusCode = 500, message } = error;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
};
