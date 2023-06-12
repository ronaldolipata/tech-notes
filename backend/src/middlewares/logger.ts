import { format } from 'date-fns';
import { v4 as uuid } from 'uuid';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from 'express';

export async function logEvents(
  message: string,
  logFileName: string
): Promise<void> {
  try {
    const dateTime: string = format(new Date(), 'yyyyMMdd\tHH:mm:ss');
    const logItem: string = `${dateTime}\t${uuid()}\t${message}\n`;

    if (!fs.existsSync(path.join(__dirname, '..', '..', 'logs'))) {
      await fsPromises.mkdir(path.join(__dirname, '..', '..', 'logs'));
    }

    await fsPromises.appendFile(
      path.join(__dirname, '..', '..', 'logs', logFileName),
      logItem
    );
  } catch (error) {
    console.log(error);
  }
}

export function logger(req: Request, _: Response, next: NextFunction): void {
  logEvents(
    `${req.method}\t${req.url}\t${req.headers.origin}`,
    'requestLog.log'
  );
  console.log(`${req.method} ${req.path}`);
  next();
}
