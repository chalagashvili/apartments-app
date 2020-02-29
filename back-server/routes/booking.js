const controllers = require('../controllers');
const { verifyAccess } = require('../middlewares/verifyAccess');
const { bookerRoles, clientRole } = require('../services/const');
const {
  findUserWithRole, findApartmentWithClient, findAvailableApartment,
} = require('../middlewares/finderHelpers');
const { validate } = require('../middlewares/validate');
const { validateResults } = require('../middlewares/validateResults');

const userControl = controllers.userController;

module.exports = (app, requireAuth) => {
  app.get('/users/:userId/bookings', [requireAuth, validate('userIdValidation'), validateResults,
    verifyAccess(bookerRoles), findUserWithRole(clientRole)], userControl.getBookings);
  app.post('/users/:userId/bookings/:apartmentId', [requireAuth, validate('userAndApartmentIdsValidation'),
    validateResults, verifyAccess(bookerRoles), findUserWithRole(clientRole)],
  findAvailableApartment, userControl.bookApartment);
  app.delete('/users/:userId/bookings/:apartmentId', [requireAuth, validate('userAndApartmentIdsValidation'),
    validateResults, verifyAccess(bookerRoles), findUserWithRole(clientRole),
    findApartmentWithClient], userControl.unbookApartment);
};
