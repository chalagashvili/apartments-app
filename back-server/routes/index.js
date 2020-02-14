const passport = require('passport');
const controllers = require('../controllers');
require('../services/passport');

const authControl = controllers.authController;
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = (app) => {
  app.post('/signIn', requireSignin, authControl.signIn);
  app.post('/signUp', authControl.signUp);
  app.post('/forgotPassword', authControl.forgotPassword);
  app.post('/resetPassword', authControl.resetPassword);
  /* Client routes */
  app.get('/users/:id', requireAuth, () => {});
  app.put('/users/:id', requireAuth, () => {});
  app.delete('/users/:id', requireAuth, () => {});
  app.get('/users/:id/apartments', requireAuth, () => {});
  app.post('/apartments/:id/rent', requireAuth, () => {});
  app.delete('apartments/:id/rent', requireAuth, () => {});
  /* Realtor routes */
  app.get('/apartments', requireAuth, () => {});
  app.post('/apartments', requireAuth, () => {});
  app.put('/apartments/:id', requireAuth, () => {});
  app.delete('/apartments/:id', requireAuth, () => {});
  /* Admin routes */
  app.get('/users', requireAuth, () => {});
  app.post('/users', requireAuth, (_, res) => { res.status(200).send({ ok: true }); });
};
