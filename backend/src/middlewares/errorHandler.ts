import { Request, Response, NextFunction } from 'express';
import { logEvents } from './logger';

export default function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logEvents(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    'errorLog.log'
  );

  console.log(err.stack);
  const status: number = res.statusCode ? res.statusCode : 500; // server error
  res.status(status).json({ message: err.message });
  next();
}
