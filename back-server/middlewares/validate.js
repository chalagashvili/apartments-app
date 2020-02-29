const { param, body } = require('express-validator');
const { adminRole } = require('../services/const');

const validations = {
  userId: param('userId')
    .exists()
    .withMessage('User ID does not exist')
    .isMongoId()
    .withMessage('User ID is not valid mongo ID'),
  apartmentId: param('apartmentId', 'Apartment ID does not exist or is invalid')
    .exists()
    .withMessage('Apartment ID does not exist')
    .isMongoId()
    .withMessage('Apartment ID is invalid'),
  password: body('password', 'Password length must be >= 8')
    .optional()
    .isLength({ min: 8 }),
  signupRole: body('role')
    .custom((role) => {
      if (adminRole.includes(role)) {
        throw new Error('You cannot sign up as admin');
      } return true;
    }),
  editRole: body('role')
    .custom((role, { req }) => {
      if (!adminRole.includes(req.user.role)) {
        throw new Error('Only admin can make other person admin');
      }
      return true;
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
    case 'editUser': {
      return [validations.userId, validations.password, validations.editRole];
    }
    case 'signUp': {
      return [validations.password, validations.signupRole];
    }
    default: return [];
  }
};

module.exports = { validate };
