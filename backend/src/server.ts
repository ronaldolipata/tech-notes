import express, { Express } from 'express';
import dotenv from 'dotenv';
import path from 'node:path';
import rootRouter from './routes/root';
import { logger, logEvents } from './middlewares/logger';
import errorHandler from './middlewares/errorHandler';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import corsOptions from './config/corsOptions';
import connectToDatabase from './config/mongooseService';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes';

// Configure dotenv to use variables from .env file
dotenv.config();

connectToDatabase();

// Initialize express app
const app: Express = express();
const PORT = process.env.PORT || 3000;

// Global middlewares
app.use(logger);
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// Tell express where to look for static files
app.use('/', express.static(path.join(__dirname, '..', 'public')));

app.use('/', rootRouter);
app.use('/users', userRoutes);

app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ message: '404 Not Found' });
  } else {
    res.type('txt').send('404 Not Found');
  }
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
});

mongoose.connection.on('error', (error) => {
  console.log(error);
  logEvents(
    `${error.no}: ${error.code}\t${error.syscall}\t${error.hostname}`,
    'mongodbErrorLog.log'
  );
});
