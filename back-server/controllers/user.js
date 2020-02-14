/* eslint-disable no-param-reassign */
const validator = require('validator');
const nodemailer = require('nodemailer');
const { promisify } = require('util');
const utils = require('../services/utility');
const {
  errorResponse,
  validationError,
  successResponse,
  notFoundResponse,
  unauthorizedResponse,
  successResponseWithData,
} = require('../services/apiResponse');
const { adminRole, allRoles } = require('../services/const');

const UserSchema = require('../models').userSchema;

const randomBytesAsync = promisify(crypto.randomBytes);

/*
 * DELETE /users/userId
 * Delete user account.
 */

exports.deleteUser = (req, res, next) => {
  let userId = req.user.id;
  // Check if 3rd person's account is being closed
  if (req.params.id) {
    // Check if Admin is performing deletion, otherwise return error
    if (!adminRole.includes(req.user.role)) return unauthorizedResponse(res, 'You don\'t have enough permissions');
    // Re-assign correct id
    userId = req.params.id;
  }
  return UserSchema.deleteOne({ _id: userId }, (err) => {
    if (err) { return next(err); }
    return successResponse(res, 'Account deleted successfully');
  });
};

/*
 * POST /users
 * Add user account.
 */

exports.addUser = (req, res, next) => {
  const { email, role, name } = req.body;
  if (!allRoles.includes(role)) return validationError(res, 'Role is invalid');
  if (!validator.isEmail(email)) return validationError(res, 'Email is invalid');
  if (!adminRole.includes(req.user.role)) return unauthorizedResponse(res, 'You don\'t have enough priviliges ');

  const password = utils.generatePassword();

  const createRandomToken = randomBytesAsync(16)
    .then((buf) => buf.toString('hex'));

  const createNewUser = (token) => {
    const newUser = new UserSchema({
      email: validator.normalizeEmail(email, { gmail_remove_dots: false }),
      password,
      passwordResetToken: token,
      passwordResetExpires: Date.now() + 3600000, // 1 hour
      role,
      name,
    });
    newUser.save();
    return newUser;
  };

  const sendAccountCreatedEmail = (user) => {
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
    .then(sendAccountCreatedEmail)
    .catch(next);
};

/*
 * PUT /users/id
 * Update existing user
 */

exports.editUser = async (req, res, next) => {
  let { user } = req;
  // Check if 3rd person's data is changed
  if (req.params.id) {
    // Check if Admin is making the changes, otherwise return error
    if (!adminRole.includes(req.user.role)) return unauthorizedResponse(res, 'You don\'t have enough permissions');
    try {
      user = await UserSchema.findById(req.params.id);
      if (!user) {
        return notFoundResponse(res, 'User with given ID was not found');
      }
    } catch (error) {
      return next(error);
    }
  }
  const {
    password, confirmPassword, email, role, name,
  } = req.body;
  /* Check if changing password */
  if (password) {
    if (!validator.isLength(password, { min: 8 })) return validationError(res, 'Password length must be >= 8');
    if (password !== confirmPassword) return validationError(res, 'Passwords do not match');
    // password is good
    user.password = password;
  }
  /* Check if changing email */
  if (email) {
    if (!validator.isEmail(email)) return validationError(res, 'Email is invalid');
    user.email = email;
  }
  /* Check if changing role */
  if (role) {
    if (!allRoles.includes(role)) return validationError(res, 'Role is invalid');
    /* Check if the person we are updating is Admin already - if yes, it is prohobitied then */
    if (adminRole.includes(user.role)) return unauthorizedResponse(res, 'You don\'t have enough permissions');
    user.role = role;
  }
  /* Check if changing name */
  if (name) {
    user.name = name;
  }
  return user.save((saveErr) => {
    if (saveErr) {
      console.log('saveErr', saveErr);
      console.log('saveErr.code', saveErr.code);
      if (saveErr.code === 11000) {
        return validationError(res, 'Email address is already in use');
      }
      return next(saveErr);
    }
    return successResponse(res, 'User updated successfully');
  });
};

/*
 * GET /users/id
 * Fetch existing user
 */

exports.getUser = (req, res, next) => {
  let userId = req.user.id;
  // Check if 3rd person's account is being closed
  if (req.params.id) {
    // Check if Admin is performing fetch, otherwise return error
    if (!adminRole.includes(req.user.role)) return unauthorizedResponse(res, 'You don\'t have enough permissions');
    // Re-assign correct id
    userId = req.params.id;
  }
  return UserSchema.findById({ _id: userId }, (err, user) => {
    if (err) return next(err);
    if (!user) return notFoundResponse(res, 'User with provided ID was not found');
    /* Check if the person we are fetching is Admin already - if yes, it is prohobitied then */
    if (adminRole.includes(user.role)) return unauthorizedResponse(res, 'You don\'t have enough permissions');
    const { name, role, email } = user;
    return successResponseWithData(res, 'User fetched successfully', { name, role, email });
  });
};

/*
 * GET /users
 * Fetch all users (excluding Admins)
 */

exports.getUsers = (req, res, next) => {
  // Check if Admin is performing fetch, otherwise return error
  if (!adminRole.includes(req.user.role)) return unauthorizedResponse(res, 'You don\'t have enough permissions');
  // implement pagination HERE @ TODO
  return UserSchema.findById({ _id: userId }, (err, user) => {
    if (err) return next(err);
    if (!user) return notFoundResponse(res, 'User with provided ID was not found');
    /* Check if the person we are fetching is Admin already - if yes, it is prohobitied then */
    if (adminRole.includes(user.role)) return unauthorizedResponse(res, 'You don\'t have enough permissions');
    const { name, role, email } = user;
    return successResponseWithData(res, 'User fetched successfully', { name, role, email });
  });
};
