const passport = require('passport');
const controllers = require('../controllers');
require('../services/passport');

const authControl = controllers.authController;
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = (app) => {
  app.post('/api/signIn', requireSignin, authControl.signIn);
  app.post('/api/signUp', authControl.signUp);
  app.post('/api/account/profile', requireAuth, authControl.postUpdateProfile);
  app.post('/api/account/password', requireAuth, authControl.postUpdatePassword);
  app.delete('/api/account/delete', requireAuth, authControl.postDeleteAccount);
};
