const {
  notFoundResponse, unauthorizedResponse,
} = require('../services/apiResponse');
const { userWasNotFoundErrorText, notEnoughPermissionsErrorText } = require('../services/const');
const UserSchema = require('../models').userSchema;

exports.findUserWithRole = (allowedRoles) => async (req, res, next) => {
  try {
    const user = await UserSchema.findById(req.params.userId);
    if (!user) return notFoundResponse(res, userWasNotFoundErrorText);
    if (!allowedRoles.includes(user.role)) {
      return unauthorizedResponse(res, notEnoughPermissionsErrorText);
    }
    res.locals.user = user;
    return next();
  } catch (error) {
    throw new Error(error);
  }
};
