/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const chalk = require('chalk');
const rateLimit = require('express-rate-limit');
const router = require('./routes/index.js');

const { errorResponse, notFoundResponse } = require('./services/apiResponse');

const app = express();
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
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
app.use((req, res, next) => {
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
/* Handle Application Errors */
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  console.error(err.stack);
  errorResponse(res, 'Something went wrong, try again!');
});
/* Handle 404 errors */
// eslint-disable-next-line no-unused-vars
app.use((req, res, next) => {
  notFoundResponse(res, 'No route found for you');
});

app.listen(4000);

module.exports = app;
