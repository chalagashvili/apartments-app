const {
  unauthorizedResponse,
} = require('../services/apiResponse');
const {
  adminRole, notEnoughPermissionsErrorText,
} = require('../services/const');

/*
  Middleware for authorization verification
*/

exports.verifyAccess = (allowedRoles) => (req, res, next) => {
  const { userId } = req.params;
  const { _id: callerId } = req.user;
  const { role: callerRole } = req.user;
  if (userId && userId !== callerId.toString()) {
    // Check if user is admin, otherwise return error
    if (!adminRole.includes(callerRole)) {
      return unauthorizedResponse(res, notEnoughPermissionsErrorText);
    }
  }
  // Check if user's role is included in allowed roles
  if (!allowedRoles.includes(callerRole)) {
    return unauthorizedResponse(res, notEnoughPermissionsErrorText);
  }
  return next();
};
