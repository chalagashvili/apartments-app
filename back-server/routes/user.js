const controllers = require('../controllers');
const { validate } = require('../middlewares/validate');
const { verifyAccess } = require('../middlewares/verifyAccess');
const { findUserWithRole } = require('../middlewares/finderHelpers');
const { validateResults } = require('../middlewares/validateResults');
const { adminRole, regularRoles, allRoles } = require('../services/const');

const userControl = controllers.userController;

module.exports = (app, requireAuth) => {
  app.get('/users/:userId', [requireAuth, validate('userIdValidation'), validateResults, verifyAccess(adminRole),
    findUserWithRole(regularRoles)],
  userControl.getUser);
  app.put('/users/:userId', [requireAuth, validate('editUser'), validateResults, verifyAccess(allRoles),
    findUserWithRole(allRoles)],
  userControl.editUser);
  app.delete('/users/:userId', [requireAuth, validate('userIdValidation'), validateResults, verifyAccess(adminRole),
    findUserWithRole(regularRoles)],
  userControl.deleteUser);
  app.get('/users', [requireAuth, verifyAccess(adminRole)], userControl.getUsers);
  app.post('/users', [requireAuth, verifyAccess(adminRole)], userControl.addUser);
};
