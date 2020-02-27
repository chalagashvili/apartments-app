/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const utils = require('../services/utility');
const {
  validationError,
  successResponse,
  successResponseWithData,
} = require('../services/apiResponse');

const UserSchema = require('../models').userSchema;

/*
  POST /auth/signIn
  Perform login and return JWT token
*/

exports.signIn = (req, res) => successResponseWithData(res, 'Sign in successfull', {
  token: utils.tokenForUser(req.user),
  email: req.user.email,
  role: req.user.role,
  id: req.user._id,
});

/*
  POST /auth/signUp
  Perform signup operation with email and password
*/

exports.signUp = (req, res, next) => {
  const user = new UserSchema(req.body);
  return user.save((saveErr, savedUser) => {
    if (saveErr) next(saveErr);
    return successResponseWithData(res, 'Sign up successfull', {
      token: utils.tokenForUser(user),
      email: user.email,
      role: user.role,
      id: savedUser._id,
    });
  });
};

/**
 * POST /auth/resetPassword/:token
 * Process the reset password request.
 */
exports.resetPassword = (req, res, next) => UserSchema
  .findOne({ passwordResetToken: req.params.token })
  .where('passwordResetExpires').gt(Date.now())
  .then((user) => {
    if (!user) return validationError(res, 'Password reset token is invalid or has expired');
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    return user.save((err) => {
      if (err) return next(err);
      const mailOptions = {
        to: user.email,
        fromEmail: 'no-reply@irakli.com',
        fromName: 'Estate Company',
        subject: 'Your Iraklis Assignment password has been changed',
        text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`,
      };
      return utils.sendEmail(mailOptions)
        .then(() => successResponse(res, 'Password has been successfully reset!'))
        .catch(() => successResponse(res, 'Password has been reset, but confirmation email was not send.'));
    });
  });

/*
 * GET /auth/me
 * Fetch personal info for a user
 */

exports.getPersonalInfo = (req, res) => {
  const {
    name, role, email, createdAt,
  } = req.user;
  return successResponseWithData(res, 'User personal info fetched successfully', {
    data: [{
      name, role, email, createdAt,
    },
    ],
  });
};
