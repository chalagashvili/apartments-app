const passport = require('passport');
const controllers = require('../controllers');
require('../services/passport');

const authControl = controllers.authController;
const userControl = controllers.userController;
const apartmentControl = controllers.apartmentController;
const testingControl = controllers.testingController;
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });
const {
  nonClientRole, realtorOnlyRole, adminRole, nonAdminRole, nonRealtorRole,
  clientOnlyRole,
} = require('../services/const');
const {
  findUserWithRole, findApartmentWithRealtor, findApartmentWithClient, findAvailableApartment,
} = require('../middlewares/finderHelpers');
const { validate } = require('../middlewares/validate');

const { validateResults } = require('../middlewares/validateResults');
const { verifyAccess } = require('../middlewares/verifyAccess');

module.exports = (app) => {
  app.post('/auth/signIn', requireSignin, authControl.signIn);
  app.post('/auth/signUp', authControl.signUp);
  app.post('/auth/resetPassword/:token', authControl.resetPassword);
  app.get('/auth/me', requireAuth, authControl.getPersonalInfo);

  /* Client routes */
  app.get('/users/:id/bookings', [requireAuth, verifyAccess(nonRealtorRole)], userControl.getBookings);
  app.post('/users/:id/bookings/:apartmentId', [requireAuth, validate('deleteBooking'),
    validateResults, verifyAccess(nonRealtorRole), findUserWithRole(clientOnlyRole)],
  findAvailableApartment, userControl.bookApartment);
  app.delete('/users/:userId/bookings/:apartmentId', [requireAuth, validate('deleteBooking'),
    validateResults, verifyAccess(nonRealtorRole), findUserWithRole(clientOnlyRole),
    findApartmentWithClient],
  userControl.unbookApartment);
  app.get('/apartments', [requireAuth, verifyAccess(nonRealtorRole)], apartmentControl.getAvailableApartments);

  /* Realtor routes */
  app.get('/users/:userId/apartments', [requireAuth, validate('getWithUserId'),
    validateResults, verifyAccess(nonClientRole)], userControl.getOwnedApartments);
  app.get('/users/:userId/apartments/:apartmentId', [requireAuth, verifyAccess(nonClientRole)],
    userControl.getSingleApartment);
  app.post('/users/:userId/apartments', [requireAuth, validate('postApartment'),
    validateResults, verifyAccess(nonClientRole)],
  userControl.addApartment);
  app.put('/users/:userId/apartments/:apartmentId', [requireAuth, validate('putApartment'),
    validateResults, verifyAccess(nonClientRole), findUserWithRole(realtorOnlyRole),
    findApartmentWithRealtor],
  userControl.updateApartment);
  app.delete('/users/:userId/apartments/:apartmentId', [requireAuth, validate('deleteApartment'),
    validateResults, verifyAccess(nonClientRole), findUserWithRole(realtorOnlyRole),
    findApartmentWithRealtor],
  userControl.deleteApartment);

  /* Admin routes */
  app.get('/users/:userId', [requireAuth, validate('getUser'), verifyAccess(adminRole),
    findUserWithRole(nonAdminRole)],
  userControl.getUser);
  app.put('/users/:userId', [requireAuth, validate('putUser'), verifyAccess(adminRole),
    findUserWithRole(nonAdminRole)],
  userControl.editUser);
  app.delete('/users/:userId', [requireAuth, validate('deleteUser'), verifyAccess(adminRole),
    findUserWithRole(nonAdminRole)],
  userControl.deleteUser);
  app.get('/users', [requireAuth, verifyAccess(adminRole)], userControl.getUsers);
  app.post('/users', [requireAuth, verifyAccess(adminRole)], userControl.addUser);

  /* Testing ability to reset the DB */
  if (process.env.NODE_ENV === 'test') {
    app.delete('/testing/reset', testingControl.resetDatabase);
  }
};
