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
  apartmentRoles, realtorRole, adminRole, regularRoles, bookerRoles,
  clientRole, allRoles,
} = require('../services/const');
const {
  findUserWithRole, findApartmentWithRealtor, findApartmentWithClient, findAvailableApartment,
} = require('../middlewares/finderHelpers');
const { validate } = require('../middlewares/validate');

const { validateResults } = require('../middlewares/validateResults');
const { verifyAccess } = require('../middlewares/verifyAccess');

module.exports = (app) => {
  app.post('/auth/signIn', requireSignin, authControl.signIn);
  app.post('/auth/signUp', [validate('signUp'), validateResults], authControl.signUp);
  app.post('/auth/resetPassword/:token', authControl.resetPassword);
  app.get('/auth/me', requireAuth, authControl.getPersonalInfo);

  /* Client routes */
  app.get('/users/:userId/bookings', [requireAuth, verifyAccess(bookerRoles), findUserWithRole(clientRole)],
    userControl.getBookings);
  app.post('/users/:userId/bookings/:apartmentId', [requireAuth, validate('userAndApartmentIdsValidation'),
    validateResults, verifyAccess(bookerRoles), findUserWithRole(clientRole)],
  findAvailableApartment, userControl.bookApartment);
  app.delete('/users/:userId/bookings/:apartmentId', [requireAuth, validate('userAndApartmentIdsValidation'),
    validateResults, verifyAccess(bookerRoles), findUserWithRole(clientRole),
    findApartmentWithClient], userControl.unbookApartment);
  app.get('/apartments', [requireAuth, verifyAccess(bookerRoles)], apartmentControl.getAvailableApartments);

  /* Realtor routes */
  app.get('/users/:userId/apartments', [requireAuth, validate('userIdValidation'),
    validateResults, verifyAccess(apartmentRoles), findUserWithRole(realtorRole)],
  userControl.getOwnedApartments);
  app.get('/users/:userId/apartments/:apartmentId', [requireAuth, validate('userAndApartmentIdsValidation'),
    verifyAccess(apartmentRoles)], userControl.getSingleApartment);
  app.post('/users/:userId/apartments', [requireAuth,
    validate('userIdValidation'), validateResults, verifyAccess(apartmentRoles), findUserWithRole(realtorRole)],
  userControl.addApartment);
  app.put('/users/:userId/apartments/:apartmentId', [requireAuth, validate('userAndApartmentIdsValidation'),
    validateResults, verifyAccess(apartmentRoles), findUserWithRole(realtorRole),
    findApartmentWithRealtor],
  userControl.updateApartment);
  app.delete('/users/:userId/apartments/:apartmentId', [requireAuth, validate('userAndApartmentIdsValidation'),
    validateResults, verifyAccess(apartmentRoles), findUserWithRole(realtorRole),
    findApartmentWithRealtor],
  userControl.deleteApartment);

  /* Admin routes */
  app.get('/users/:userId', [requireAuth, validate('userIdValidation'), verifyAccess(adminRole),
    findUserWithRole(regularRoles)],
  userControl.getUser);
  app.put('/users/:userId', [requireAuth, validate('editUser'), verifyAccess(allRoles),
    findUserWithRole(allRoles)],
  userControl.editUser);
  app.delete('/users/:userId', [requireAuth, validate('userIdValidation'), verifyAccess(adminRole),
    findUserWithRole(regularRoles)],
  userControl.deleteUser);
  app.get('/users', [requireAuth, verifyAccess(adminRole)], userControl.getUsers);
  app.post('/users', [requireAuth, verifyAccess(adminRole)], userControl.addUser);

  /* Testing ability to reset the DB */
  if (process.env.NODE_ENV === 'test') {
    app.delete('/testing/reset', testingControl.resetDatabase);
  }
};
