const passport = require('passport');
const controllers = require('../controllers');
require('../services/passport');

const authControl = controllers.authController;
const userControl = controllers.userController;
const apartmentControl = controllers.apartmentController;
const testControl = controllers.testController;
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = (app) => {
  app.post('/auth/signIn', requireSignin, authControl.signIn);
  app.post('/auth/signUp', authControl.signUp);
  app.post('/auth/forgotPassword', authControl.forgotPassword);
  app.post('/auth/resetPassword/:token', authControl.resetPassword);
  app.get('/auth/me', requireAuth, authControl.getPersonalInfo);

  /* Client routes */
  app.get('/users/:id', requireAuth, userControl.getUser);
  app.put('/users/:id', requireAuth, userControl.editUser);
  app.delete('/users/:id', requireAuth, userControl.deleteUser);

  app.get('/users/:id/bookings', requireAuth, userControl.getBookings);
  app.post('/users/:id/bookings/:apartmentId', requireAuth, userControl.bookApartment);
  app.delete('/users/:id/bookings/:apartmentId', requireAuth, userControl.unbookApartment);

  app.get('/apartments', requireAuth, apartmentControl.getAvailableApartments);

  /* Realtor routes */
  app.get('/users/:id/apartments', requireAuth, userControl.getOwnedApartments);
  app.get('/users/:id/apartments/:apartmentId', requireAuth, userControl.getSingleApartment);
  app.post('/users/:id/apartments', requireAuth, userControl.addApartment);
  app.put('/users/:id/apartments/:apartmentId', requireAuth, userControl.updateApartment);
  app.delete('/users/:id/apartments/:apartmentId', requireAuth, userControl.deleteApartment);

  /* Admin routes */
  app.get('/users', requireAuth, userControl.getUsers);
  app.post('/users', requireAuth, userControl.addUser);

  /* Testing ability to reset the DB */
  if (process.env.NODE_ENV === 'test') {
    app.delete('/testing/reset', testControl.resetDatabase);
  }
};
