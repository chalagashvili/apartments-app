/* eslint-disable no-console */
import express from 'express';

import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';
import passport from 'passport';

import chalk from 'chalk';
import rateLimit from 'express-rate-limit';
import router from './routes';

import { errorResponse } from './services/apiResponse';

require('dotenv').config();

const app = express();
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});
app.use(morgan('combined'));
app.use(cors());
app.use((_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

const jsonParser = bodyParser.json({ limit: 1024 * 1024 * 20, type: '*/*' });
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
});
app.use(limiter);
app.use(jsonParser);
app.use(passport.initialize());
router(app);
app.disable('x-powered-by');
app.use((err, _, res) => {
  console.log(err);
  errorResponse(res, 'Internal Server Error Has Occured! What a Shame...');
});

app.listen(4000);

module.exports = app;
