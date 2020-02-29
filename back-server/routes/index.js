require('../services/passport');
const passport = require('passport');
const controllers = require('../controllers');
const userRoutes = require('./user');
const authRoutes = require('./auth');
const bookingRoutes = require('./booking');
const apartmentRoutes = require('./apartment');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });
const testingControl = controllers.testingController;

module.exports = (app) => {
  authRoutes(app, requireAuth, requireSignin);
  userRoutes(app, requireAuth);
  bookingRoutes(app, requireAuth);
  apartmentRoutes(app, requireAuth);
  /* Testing ability to reset the DB */
  if (process.env.NODE_ENV === 'test') {
    app.delete('/testing/reset', testingControl.resetDatabase);
  }
};
