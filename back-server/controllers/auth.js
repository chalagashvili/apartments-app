/* eslint-disable no-param-reassign */
import _ from 'lodash';
import validator from 'validator';
import crypto from 'crypto';
import { promisify } from 'util';
import nodemailer from 'nodemailer';
import utils from '../services/utility';
import {
  errorResponse,
  validationError,
  successResponse,
  unauthorizedResponse,
  successResponseWithData,
} from '../services/apiResponse';
import { adminRole, allRoles } from '../services/const';


const randomBytesAsync = promisify(crypto.randomBytes);

const UserSchema = require('../models').userSchema;

/*
  Perform login and return JWT token
*/

export function signIn(req, res) {
  return successResponseWithData(res, 'Sign in successfull', {
    token: utils.tokenForUser(req.user),
    email: req.user.email,
  });
}

/*
  Perform signup operation with email and password
*/

export function signUp(req, res, next) {
  const { email, password } = req.body;
  if (!validator.isEmail(email)) return validationError(res, 'Email is invalid');
  if (!validator.isLength(password, { min: 6 })) return validationError(res, 'Password length must be >= 6');

  return UserSchema.findOne({ email }, (err, existingUser) => {
    if (err) return next(err);
    if (existingUser) return validationError(res, 'Email is already in use');
    const user = new UserSchema({
      email: validator.normalizeEmail(email, { gmail_remove_dots: false }),
      password,
    });
    return user.save((saveErr) => {
      if (saveErr) next(saveErr);
      return successResponseWithData(res, 'Sign up successfull', {
        token: utils.tokenForUser(req.user),
        email: req.user.email,
      });
    });
  });
}

/*
  Perform signup operation with email and password for 3rd person and send invite link
*/

export function signUpForRegularUser(req, res, next) {
  const { email } = req.body;
  if (!validator.isEmail(email)) return validationError(res, 'Email is invalid');

  const password = utils.generatePassword();

  const createRandomToken = randomBytesAsync(16)
    .then((buf) => buf.toString('hex'));

  const createNewUser = (token) => {
    const newUser = new UserSchema({
      email: validator.normalizeEmail(email, { gmail_remove_dots: false }),
      password,
      passwordResetToken: token,
      passwordResetExpires: Date.now() + 3600000, // 1 hour
    });
    newUser.save();
    return newUser;
  };

  const sendForgotPasswordEmail = (user) => {
    if (!user) { return; }
    const token = user.passwordResetToken;
    const transporter = nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASSWORD,
      },
    });
    const mailOptions = {
      to: user.email,
      from: 'no-reply@irakli.com',
      subject: 'You are invited to join Iraklis Assignment',
      text: `You are receiving this email because you have been invited to join our marvelous app.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://${req.headers.host}/reset/${token}\n\n
        If you did not request this, please ignore this email and no account will be created.\n`,
    };
    // eslint-disable-next-line consistent-return
    return transporter.sendMail(mailOptions)
      .then(() => successResponse(res, `An e-mail has been sent to ${user.email} with further instructions.`))
      .catch(() => errorResponse(res, 'Password reset token has been generated but could not send an email'));
  };

  return createRandomToken
    .then(createNewUser)
    .then(sendForgotPasswordEmail)
    .catch(next);
}

/**
 * POST
 * Update profile information.
 */
exports.postUpdateProfile = (req, res, next) => {
  let { email } = req.body;
  if (!validator.isEmail(email)) return validationError(res, 'Email is invalid');
  email = validator.normalizeEmail(email, { gmail_remove_dots: false });

  return UserSchema.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    if (user.email !== email) user.emailVerified = false;
    user.email = email || '';
    user.profile.name = req.body.name || '';
    user.profile.bio = req.body.bio || '';
    return user.save((saveErr) => {
      if (saveErr) {
        if (saveErr.code === 11000) {
          return validationError(res, 'Email address is already in use');
        }
        return next(saveErr);
      }
      return successResponse(res, 'Profile updated successfully');
    });
  });
};

/**
 * POST
 * Update profile information for 3rd person.
 */
exports.postUpdateUnownedProfile = (req, res, next) => {
  const {
    id, name, bio, role,
  } = req.body;
  let { email } = req.body;
  if (id == null) return validationError(res, 'Account id is invalid');
  if (!allRoles.includes(role)) return validationError(res, 'Role is invalid');
  if (!validator.isEmail(email)) return validationError(res, 'Email is invalid');
  email = validator.normalizeEmail(email, { gmail_remove_dots: false });

  return UserSchema.findById(id, (err, user) => {
    if (err) { return next(err); }
    if (!adminRole.includes(user.role)) return unauthorizedResponse(res, 'You cannot update admins\'s account!');
    if (user.email !== email) user.emailVerified = false;
    user.role = role || 'user';
    user.email = email || '';
    user.profile.name = name || '';
    user.profile.bio = bio || '';
    return user.save((saveErr) => {
      if (saveErr) {
        if (saveErr.code === 11000) {
          return validationError(res, 'Email address is already in use');
        }
        return next(saveErr);
      }
      return successResponse(res, 'Profile updated successfully');
    });
  });
};

/**
 * POST /account/password
 * Update current password.
 */
exports.postUpdatePassword = (req, res, next) => {
  const { password, confirmPassword } = req.body;
  if (!validator.isLength(req.body.password, { min: 8 })) return validationError(res, 'Password length must be >= 6');
  if (password !== confirmPassword) return validationError(res, 'Passwords do not match');

  return UserSchema.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.password = password;
    return user.save((saveErr) => {
      if (saveErr) { return next(saveErr); }
      return successResponse(res, 'Password updated successfully');
    });
  });
};

/**
 * DELETE /account/delete
 * Close user account.
 */
exports.postDeleteAccount = (req, res, next) => {
  UserSchema.deleteOne({ _id: req.user.id }, (err) => {
    if (err) { return next(err); }
    return successResponse(res, 'Account closed successfully');
  });
};

/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */
exports.getOauthUnlink = (req, res, next) => {
  const { provider } = req.params;
  UserSchema.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user[provider.toLowerCase()] = undefined;
    const tokensWithoutProviderToUnlink = user.tokens.filter(
      (token) => token.kind !== provider.toLowerCase(),
    );
    // Some auth providers do not provide an email address in the user profile.
    // As a result, we need to verify that unlinking the provider is safe by ensuring
    // that another login method exists.
    if (
      !(user.email && user.password)
      && tokensWithoutProviderToUnlink.length === 0
    ) {
      return errorResponse(res, `The ${_.startCase(_.toLower(provider))} account cannot be unlinked without another form of login enabled.`
      + ' Please link another account or add an email address and password.');
    }
    user.tokens = tokensWithoutProviderToUnlink;
    return user.save((saveErr) => {
      if (saveErr) { return next(saveErr); }
      return successResponse(res, `${_.startCase(_.toLower(provider))} account has been unlinked.`);
    });
  });
};

/**
 * POST /forgot
 * Generate a random token, then the send user an email with a reset link.
 */
exports.postForgot = (req, res, next) => {
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
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASSWORD,
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
exports.postReset = (req, res, next) => {
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
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASSWORD,
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

/**
 * GET /account/verify/:token
 * Verify email address
 */
exports.getVerifyEmailToken = (req, res) => {
  if (req.user.emailVerified) return validationError(res, 'Email has already been verified');
  const { token } = req.params.token;
  if (token && (!validator.isHexadecimal(token))) return validationError(res, 'Invalid token, please try again');

  if (token === req.user.emailVerificationToken) {
    return UserSchema
      .findOne({ email: req.user.email })
      .then((user) => {
        if (!user) {
          req.flash('errors', { msg: 'There was an error in loading your profile.' });
          return res.redirect('back');
        }
        user.emailVerificationToken = '';
        user.emailVerified = true;
        user = user.save();
        return successResponse(res, 'Emails has been successfully verified');
      })
      .catch(() => errorResponse(res, 'There was an error when updating your profile.  Please try again later.'));
  }
  return validationError(res, 'Invalid token, please try again');
};

/**
 * GET /account/verify
 * Verify email address
 */
exports.getVerifyEmail = (req, res, next) => {
  if (req.user.emailVerified) return validationError(res, 'Email has already been verified');
  const { email } = req.body;
  if (!validator.isEmail(email)) return validationError(res, 'Email is invalid');

  const createRandomToken = randomBytesAsync(16)
    .then((buf) => buf.toString('hex'));

  const setRandomToken = (token) => {
    UserSchema
      .findOne({ email: req.user.email })
      .then((user) => {
        user.emailVerificationToken = token;
        user = user.save();
      });
    return token;
  };

  const sendVerifyEmail = (token) => {
    const transporter = nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASSWORD,
      },
    });
    const mailOptions = {
      to: req.user.email,
      from: 'no-reply@irakli.com',
      subject: 'Please verify your email address on Hackathon Starter',
      text: `Thank you for registering with hackathon-starter.\n\n
        This verify your email address please click on the following link, or paste this into your browser:\n\n
        http://${req.headers.host}/account/verify/${token}\n\n
        \n\n
        Thank you!`,
    };
    return transporter.sendMail(mailOptions)
      .then(() => successResponse(res, `An e-mail has been sent to ${req.user.email} with further instructions.`))
      .catch(() => errorResponse(res, 'Token has been generated but could not send an email'));
  };

  return createRandomToken
    .then(setRandomToken)
    .then(sendVerifyEmail)
    .catch(next);
};
