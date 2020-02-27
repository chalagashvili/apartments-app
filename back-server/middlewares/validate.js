const { param, body } = require('express-validator');
const { adminRole } = require('../services/const');

const validations = {
  userId: param('userId').exists().withMessage('User ID does not exist or is invalid').isMongoId()
    .withMessage('User ID is not valid mongo ID'),
  apartmentId: param('apartmentId', 'Apartment ID does not exist or is invalid').exists().isMongoId(),
  password: body('password', 'Password length must be >= 8').exists().isLength({ min: 8 }),
  signupRole: body('role').custom((role) => {
    if (adminRole.includes(role)) {
      throw new Error('You cannot sign up as admin');
    }
  }),
  editRole: body('role').custom((role, { req }) => {
    if (!adminRole.includes(req.user.role)) {
      throw new Error('Only admin can make other person admin');
    }
  }),
};

const validate = (method) => {
  switch (method) {
    case 'userAndApartmentIdsValidation': {
      return [validations.userId, validations.apartmentId];
    }
    case 'userIdValidation': {
      return [validations.userId];
    }
    case 'putUser': {
      return [validations.userId, validations.password, validations.editRole];
    }
    case 'signUp': {
      return [validations.password, validations.role];
    }
    default: return [];
  }
};

module.exports = { validate };
