const controllers = require('../controllers');
const { validate } = require('../middlewares/validate');
const { verifyAccess } = require('../middlewares/verifyAccess');
const { apartmentRoles, realtorRole, bookerRoles } = require('../services/const');
const { validateResults } = require('../middlewares/validateResults');
const { findUserWithRole, findApartmentWithRealtor } = require('../middlewares/finderHelpers');

const userControl = controllers.userController;
const apartmentControl = controllers.apartmentController;

module.exports = (app, requireAuth) => {
  app.get('/users/:userId/apartments', [requireAuth, validate('userIdValidation'),
    validateResults, verifyAccess(apartmentRoles), findUserWithRole(realtorRole)],
  userControl.getOwnedApartments);
  app.get('/users/:userId/apartments/:apartmentId', [requireAuth, validate('userAndApartmentIdsValidation'),
    validateResults, verifyAccess(apartmentRoles), findApartmentWithRealtor],
  userControl.getSingleApartment);
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
  app.get('/apartments', [requireAuth, verifyAccess(bookerRoles)], apartmentControl.getAvailableApartments);
};
