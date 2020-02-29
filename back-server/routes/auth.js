const controllers = require('../controllers');
const { validate } = require('../middlewares/validate');
const { validateResults } = require('../middlewares/validateResults');

const authControl = controllers.authController;

module.exports = (app, requireAuth, requireSignin) => {
  app.post('/auth/signIn', requireSignin, authControl.signIn);
  app.post('/auth/signUp', [validate('signUp'), validateResults], authControl.signUp);
  app.post('/auth/resetPassword/:token', authControl.resetPassword);
  app.get('/auth/me', requireAuth, authControl.getPersonalInfo);
};
