const { body, param } = require('express-validator');

const validations = {
  userId: param('userId').exists().withMessage('User ID does not exist or is invalid').isMongoId()
    .withMessage('User ID is not valid mongo ID'),
  apartmentId: param('apartmentId', 'Apartment ID does not exist or is invalid').exists().isMongoId(),
  password: body('password', 'Password length must be >= 8').exists().isLength({ min: 8 }),
};

const validate = (method) => {
  switch (method) {
    case 'getApartment': {
      return [validations.userId, validations.apartmentId];
    }
    case 'postApartment': {
      return [validations.userId];
    }
    case 'getUser': {
      return [validations.userId];
    }
    case 'putUser': {
      return [validations.userId, validations.password];
    }
    case 'deleteUser': {
      return [validations.userId];
    }
    case 'putApartment': {
      return [validations.userId, validations.apartmentId];
    }
    case 'deleteApartment': {
      return [validations.userId, validations.apartmentId];
    }
    default: return [];
  }
};

module.exports = { validate };
