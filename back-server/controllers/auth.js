/* eslint-disable no-param-reassign */
const validator = require('validator');
const crypto = require('crypto');
const { promisify } = require('util');
const nodemailer = require('nodemailer');
const utils = require('../services/utility');
const {
  errorResponse,
  validationError,
  successResponse,
  successResponseWithData,
} = require('../services/apiResponse');
const { allRoles } = require('../services/const');


const randomBytesAsync = promisify(crypto.randomBytes);

const UserSchema = require('../models').userSchema;

/*
  Perform login and return JWT token
*/

exports.signIn = (req, res) => successResponseWithData(res, 'Sign in successfull', {
  token: utils.tokenForUser(req.user),
  email: req.user.email,
  role: req.user.role,
});

/*
  Perform signup operation with email and password
*/

exports.signUp = (req, res, next) => {
  const {
    email, password, role, name, confirmPassword,
  } = req.body;
  if (password !== confirmPassword) return validationError(res, 'Passwords do not match');
  if (!allRoles.includes(role)) return validationError(res, 'Role is invalid');
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
    return user.save((saveErr) => {
      if (saveErr) next(saveErr);
      return successResponseWithData(res, 'Sign up successfull', {
        token: utils.tokenForUser(user),
        email: user.email,
        role: user.role,
      });
    });
  });
};

/**
 * POST /forgot
 * Generate a random token, then the send user an email with a reset link.
 */
exports.forgotPassword = (req, res, next) => {
  let { email } = req.body;
  if (!validator.isEmail(email)) return validationError(res, 'Please provide valid email address');
  email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });

  const createRandomToken = randomBytesAsync(16)
    .then((buf) => buf.toString('hex'));

  const setRandomToken = (token) => UserSchema
    .findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return validationError(res, 'No user found associated with the given email');
      }
      user.passwordResetToken = token;
      user.passwordResetExpires = Date.now() + 3600000; // 1 hour
      user = user.save();

      return user;
    });

  const sendForgotPasswordEmail = (user) => {
    if (!user) { return; }
    const token = user.passwordResetToken;
    const transporter = nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        api_key: process.env.SENDGRID_API_KEY,
      },
    });
    const mailOptions = {
      to: user.email,
      from: 'no-reply@irakli.com',
      subject: 'Reset your password on Iraklis Assignment',
      text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://${req.headers.host}/reset/${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };
    // eslint-disable-next-line consistent-return
    return transporter.sendMail(mailOptions)
      .then(() => successResponse(res, `An e-mail has been sent to ${user.email} with further instructions.`))
      .catch(() => errorResponse(res, 'Password reset token has been generated but could not send an email'));
  };

  return createRandomToken
    .then(setRandomToken)
    .then(sendForgotPasswordEmail)
    .catch(next);
};

/**
 * POST /reset/:token
 * Process the reset password request.
 */
exports.resetPassword = (req, res, next) => {
  const { password, confirmPassword } = req.body;
  const { token } = req.params;
  if (!validator.isLength(password, { min: 8 })) return validationError(res, 'Password length must be >= 6');
  if (password !== confirmPassword) return validationError(res, 'Passwords do not match');
  if (!validator.isHexadecimal(token)) return validationError(res, 'Invalid token, please retry');

  const resetPassword = () => UserSchema
    .findOne({ passwordResetToken: req.params.token })
    .where('passwordResetExpires').gt(Date.now())
    .then((user) => {
      if (!user) return validationError(res, 'Password reset token is invalid or has expired');
      user.password = req.body.password;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      return user.save().then(() => new Promise((resolve, reject) => {
        req.logIn(user, (err) => {
          if (err) { return reject(err); }
          return resolve(user);
        });
      }));
    });

  const sendResetPasswordEmail = (user) => {
    if (!user) { return; }
    const transporter = nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        api_key: process.env.SENDGRID_API_KEY,
      },
    });
    const mailOptions = {
      to: user.email,
      from: 'no-reply@irakli.com',
      subject: 'Your Iraklis Assignment password has been changed',
      text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`,
    };
    transporter.sendMail(mailOptions)
      .then(() => successResponse(res, 'Password has been successfully reset!'))
      .catch(() => {});
  };

  return resetPassword()
    .then(sendResetPasswordEmail)
    .catch((err) => next(err));
};
