/* eslint-disable no-param-reassign */
const validator = require('validator');
const crypto = require('crypto');
const { promisify } = require('util');
const utils = require('../services/utility');
const {
  errorResponse,
  validationError,
  successResponse,
  successResponseWithData,
} = require('../services/apiResponse');
const { allRoles, adminRole } = require('../services/const');


const randomBytesAsync = promisify(crypto.randomBytes);

const UserSchema = require('../models').userSchema;

/*
  POST /auth/signIn
  Perform login and return JWT token
*/

exports.signIn = (req, res) => successResponseWithData(res, 'Sign in successfull', {
  token: utils.tokenForUser(req.user),
  email: req.user.email,
  role: req.user.role,
  // eslint-disable-next-line no-underscore-dangle
  id: req.user._id,
});

/*
  POST /auth/signUp
  Perform signup operation with email and password
*/

exports.signUp = (req, res, next) => {
  const {
    email, password, role, name, confirmPassword,
  } = req.body;
  if (password !== confirmPassword) return validationError(res, 'Passwords do not match');
  if (!allRoles.includes(role)) return validationError(res, 'Role is invalid');
  if (adminRole.includes(role)) return validationError(res, 'You cannot sign up as admin');
  if (!validator.isEmail(email)) return validationError(res, 'Email is invalid');
  if (!validator.isLength(password, { min: 6 })) return validationError(res, 'Password length must be >= 6');

  return UserSchema.findOne({ email }, (err, existingUser) => {
    if (err) return next(err);
    if (existingUser) return validationError(res, 'Email is already in use');
    const user = new UserSchema({
      email: validator.normalizeEmail(email, { gmail_remove_dots: false }),
      password,
      role,
      name,
    });
    return user.save((saveErr, savedUser) => {
      if (saveErr) next(saveErr);
      return successResponseWithData(res, 'Sign up successfull', {
        token: utils.tokenForUser(user),
        email: user.email,
        role: user.role,
        // eslint-disable-next-line no-underscore-dangle
        id: savedUser._id,
      });
    });
  });
};

/**
 * POST /auth/forgotPassword
 * Generate a random token, then the send user an email with a reset link.
 */
exports.forgotPassword = async (req, res, next) => {
  let { email } = req.body;
  if (!validator.isEmail(email)) return validationError(res, 'Please provide valid email address');
  email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });

  try {
    const createRandomToken = await randomBytesAsync(16);
    const token = createRandomToken.toString('hex');

    return UserSchema
      .findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          return validationError(res, 'No user found associated with the given email');
        }
        user.passwordResetToken = token;
        user.passwordResetExpires = Date.now() + 3600000; // 1 hour
        return user.save((err) => {
          if (err) return next(err);
          const mailOptions = {
            to: user.email,
            fromEmail: 'no-reply@irakli.com',
            fromName: 'Estate Company',
            subject: 'Reset your password on Iraklis Assignment',
            text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
              Please click on the following link, or paste this into your browser to complete the process:\n\n
              http://${process.env.APP_URL}/reset/${token}\n\n
              If you did not request this, please ignore this email and your password will remain unchanged.\n`,
          };
          return utils.sendEmail(mailOptions)
            .then(() => successResponse(res, `An e-mail has been sent to ${user.email} with further instructions.`))
            .catch(() => errorResponse(res, 'Password reset token has been generated but could not send an email'));
        });
      });
  } catch (error) {
    return next(error);
  }
};

/**
 * POST /auth/resetPassword/:token
 * Process the reset password request.
 */
exports.resetPassword = (req, res, next) => {
  const { password, confirmPassword } = req.body;
  const { token } = req.params;
  if (!validator.isLength(password, { min: 8 })) return validationError(res, 'Password length must be >= 6');
  if (password !== confirmPassword) return validationError(res, 'Passwords do not match');
  if (!validator.isHexadecimal(token)) return validationError(res, 'Invalid token, please retry');

  return UserSchema
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
};

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
