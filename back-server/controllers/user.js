/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const validator = require('validator');
const crypto = require('crypto');
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
const { cleanUpAfterRoleChange } = require('../models/user');
const {
  adminRole, nonAdminRole, allRoles, nonRealtorRole,
} = require('../services/const');

const UserSchema = require('../models').userSchema;
const ApartmentSchema = require('../models').apartmentSchema;

const randomBytesAsync = promisify(crypto.randomBytes);

/*
 * DELETE /users/userId
 * Delete user account.
 */

exports.deleteUser = async (req, res, next) => {
  const { id: userId } = req.params;
  const { _id: callerId } = req.user;
  // Check that id is passed correctly and its a valid mongo ID
  if (!userId || !utils.validateObjectID(req.params.id)) return validationError(res, 'ID is not a valid mongo ObjectId');
  // Check if 3rd person's bookings are accessed
  if (userId !== callerId) {
    // Check if Admin is performing booking for user, otherwise return error
    if (!adminRole.includes(req.user.role)) return unauthorizedResponse(res, 'You don\'t have enough permissions');
  }
  try {
    const toDelete = await UserSchema.findOne({
      _id: userId,
    }).exec();
    if (!toDelete) return notFoundResponse(res, 'User with received ID was not found');
    await toDelete.deleteOne();
    return successResponse(res, 'Account deleted successfully');
  } catch (error) {
    return next(error);
  }
};

/*
 * POST /users
 * Add user account.
 */

exports.addUser = async (req, res, next) => {
  const { email, role, name } = req.body;
  if (!allRoles.includes(role)) return validationError(res, 'Role is invalid');
  if (!validator.isEmail(email)) return validationError(res, 'Email is invalid');
  if (!adminRole.includes(req.user.role)) return unauthorizedResponse(res, 'You don\'t have enough priviliges ');

  const password = utils.generatePassword();

  const randomTokenBytes = await randomBytesAsync(16);
  const token = randomTokenBytes.toString('hex');

  const newUser = new UserSchema({
    email: validator.normalizeEmail(email, { gmail_remove_dots: false }),
    password,
    passwordResetToken: token,
    passwordResetExpires: Date.now() + 3600000, // 1 hour
    role,
    name,
  });
  return newUser.save((saveErr) => {
    if (saveErr) {
      if (saveErr.code === 11000) {
        return validationError(res, 'Email address is already in use!');
      }
      return next(saveErr);
    }
    const mailOptions = {
      to: newUser.email,
      fromEmail: 'no-reply@irakli.com',
      fromName: 'Estate Company',
      subject: 'You are invited to join Iraklis Real Estate Company',
      text: `You are receiving this email because you have been invited to join our marvelous app.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://${process.env.APP_URL}/resetPassword/${token}\n\n
        If you did not request this, please ignore this email and no account will be created.\n`,
    };
    // eslint-disable-next-line consistent-return
    return utils.sendEmail(mailOptions)
      .then(() => successResponse(res, `An e-mail has been sent to ${newUser.email} with further instructions.`))
      .catch(() => errorResponse(res, 'Password reset token has been generated but could not send an email'));
  });
};

/*
 * PUT /users/id
 * Update existing user
 */

exports.editUser = async (req, res, next) => {
  const { id: userId } = req.params;
  const { _id: callerId } = req.user;
  let user = null;
  // Check that id is passed correctly and its a valid mongo ID
  if (!userId || !utils.validateObjectID(req.params.id)) return validationError(res, 'ID is not a valid mongo ObjectId');
  // Check if 3rd person's bookings are accessed
  if (userId !== callerId) {
    // Check if Admin is performing booking for user, otherwise return error
    if (!adminRole.includes(req.user.role)) return unauthorizedResponse(res, 'You don\'t have enough permissions');
    try {
      user = await UserSchema.findById(userId);
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
    if (password !== confirmPassword) return validationError(res, 'Password and Confirm Password do not match');
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
    if (adminRole.includes(user.role)) return unauthorizedResponse(res, 'You don\'t have enough permissions to update another admin');
    // Make sure admin is making role change, otherwise return
    if (!adminRole.includes(req.user.role)) return unauthorizedResponse(res, 'You don\'t have enough permissions, you are not admin');
    /* Do some cleanup depending the old role of the user */
    cleanUpAfterRoleChange(user);
    if (nonAdminRole.includes(user.role)) {
      user.bookings = [];
      user.ownedApartments = [];
    }
    user.role = role;
  }
  /* Check if changing name */
  if (name) {
    user.name = name;
  }
  return user.save((saveErr) => {
    if (saveErr) {
      if (saveErr.code === 11000) {
        return validationError(res, 'Email address is already in use');
      }
      return next(saveErr);
    }
    return successResponseWithData(res, 'User updated successfully', {
      data: [{
        name: user.name, role: user.role, email: user.email, createdAt: user.createdAt,
      },
      ],
    });
  });
};

/*
 * GET /users/id
 * Fetch existing user
 */

exports.getUser = (req, res, next) => {
  let userId = req.user.id;
  // Check if Admin is performing fetch, otherwise return error
  if (!adminRole.includes(req.user.role)) return unauthorizedResponse(res, 'You don\'t have enough permissions');
  // Check if received ID is valid mongo ID
  if (!req.params.id || !utils.validateObjectID(req.params.id)) return validationError(res, 'ID is not a mongo ObjectId');
  // Re-assign correct id
  userId = req.params.id;
  return UserSchema.findById({ _id: userId }, (err, user) => {
    if (err) return next(err);
    if (!user) return notFoundResponse(res, 'User with provided ID was not found');
    /* Check if the person we are fetching is Admin already - if yes, it is prohobitied then */
    if (adminRole.includes(user.role)) return unauthorizedResponse(res, 'You don\'t have enough permissions');
    const {
      name, role, email, createdAt,
    } = user;
    return successResponseWithData(res, 'User fetched successfully', {
      data: [{
        name, role, email, createdAt, id: userId,
      },
      ],
    });
  });
};

/*
 * GET /users
 * Fetch all users (excluding Admins)
 */

exports.getUsers = async (req, res, next) => {
  // Check if Admin is performing fetch, otherwise return error
  if (!adminRole.includes(req.user.role)) return unauthorizedResponse(res, 'You don\'t have enough permissions');
  const { page = 1, pageSize = 10 } = req.query;
  const options = {
    select: 'createdAt name email role',
    sort: { createdAt: -1 },
    page,
    limit: pageSize,
  };
  return UserSchema.paginate(
    { role: { $in: nonAdminRole } },
    options,
    (err, results) => {
      if (err) return next(err);
      return successResponseWithData(res, 'Users fetched successfully', results);
    },
  );
};

/*
* GET /users/:id/bookings
* Handle logic when fetching specific user's bookings list
*/

exports.getBookings = (req, res, next) => {
  const { id: userId } = req.params;
  const { _id: callerId } = req.user;
  // Check that id is passed correctly and its a valid mongo ID
  if (!userId || !utils.validateObjectID(req.params.id)) return validationError(res, 'user ID is not a valid mongo ObjectId');
  // Check if 3rd person's bookings are accessed
  if (userId !== callerId) {
    // Check if Admin is performing booking for user, otherwise return error
    if (!adminRole.includes(req.user.role)) return unauthorizedResponse(res, 'You don\'t have enough permissions');
  }
  return UserSchema.findById({ _id: userId }, (error, user) => {
    if (error) return next(error);
    const { page = 1, pageSize = 10 } = req.query;
    const options = {
      sort: { createdAt: -1 },
      page,
      limit: pageSize,
    };
    return ApartmentSchema.paginate(
      { _id: { $in: user.bookings } },
      options,
      (err, results) => {
        if (err) return next(err);
        return successResponseWithData(res, 'Bookings fetched successfully', results);
      },
    );
  });
};

/*
* POST /users/:id/bookings/:apartmentId
* Handle logic when a user is booking an apartment, or admin is renting for a user
*/

exports.bookApartment = (req, res, next) => {
  const { id: userId } = req.params;
  const { _id: callerId } = req.user;
  // Check that id is passed correctly and its a valid mongo ID
  if (!userId || !utils.validateObjectID(req.params.id)) return validationError(res, 'user ID is not a valid mongo ObjectId');
  // Check if 3rd person's bookings are accessed
  if (userId !== callerId) {
    // Check if Admin is performing booking for user, otherwise return error
    if (!adminRole.includes(req.user.role)) return unauthorizedResponse(res, 'You don\'t have enough permissions');
  }
  const { apartmentId } = req.params;
  // Check if received apartmentId is valid mongo ID
  if (!utils.validateObjectID(apartmentId)) return validationError(res, 'apartment ID is not a mongo ObjectId');
  // Check that apartment is available
  return ApartmentSchema.findById({ _id: apartmentId }, (err, apartment) => {
    if (err) return next(err);
    // Check if apartment exists
    if (!apartment) return notFoundResponse(res, 'Apartment with given ID was not found');
    if (apartment.isAvailable) {
      // Make apartment unavailable
      apartment.isAvailable = false;
      apartment.bookedBy = userId;
      return apartment.save((saveErr) => {
        if (saveErr) return next(err);
        // Add apartment is bookings array of user
        return UserSchema.findByIdAndUpdate(
          userId, { $push: { bookings: apartmentId } }, { new: true },
          (updateErr) => {
            if (updateErr) return next(err);
            return successResponseWithData(res, 'Apartment has booked succesfully', {
              data: {
                apartmentId,
              },
            });
          },
        );
      });
    }
    return validationError(res, 'The apartment you are trying to book is already booked');
  });
};

/*
* DELETE /users/:id/bookings/:apartId
* Handle logic when a user is unbooking an apartment, or admin is unbooking it for a user
*/

exports.unbookApartment = (req, res, next) => {
  const { id: userId } = req.params;
  const { _id: callerId } = req.user;
  // Check that id is passed correctly and its a valid mongo ID
  if (!userId || !utils.validateObjectID(req.params.id)) return validationError(res, 'ID is not a valid mongo ObjectId');
  // Check if 3rd person's bookings are accessed
  if (userId !== callerId) {
    // Check if Admin is performing operation, otherwise return error
    if (!adminRole.includes(req.user.role)) return unauthorizedResponse(res, 'You don\'t have enough permissions');
  }
  const { apartmentId } = req.params;
  // Check if received apartmentId is valid mongo ID
  if (!utils.validateObjectID(apartmentId)) return validationError(res, 'ID is not a mongo ObjectId');
  return ApartmentSchema.findById({ _id: apartmentId }, (err, apartment) => {
    if (err) return next(err);
    // Check if apartment exists
    if (!apartment) return notFoundResponse(res, 'Apartment with given ID was not found');
    if (apartment.bookedBy !== userId) return unauthorizedResponse(res, 'The apartment is not booked by the given user');
    apartment.isAvailable = true;
    apartment.bookedBy = null;
    return apartment.save((saveErr) => {
      if (saveErr) return next(err);
      // Remove apartment from bookings array of user
      return UserSchema.findByIdAndUpdate(
        userId, { $pull: { bookings: apartmentId } }, { new: true },
        (updateErr) => {
          if (updateErr) return next(err);
          return successResponseWithData(res, 'Apartment has unbooked succesfully', {
            data: {
              apartmentId,
            },
          });
        },
      );
    });
  });
};

/*
* POST /users/:id/apartments
* Handle logic when a realtor is adding a new apartment, or admin is adding it for realtor
*/

exports.addApartment = async (req, res, next) => {
  const {
    name, description, floorAreaSize, pricePerMonth, numberOfRooms, location,
    imageUrl,
  } = req.body;
  if (!name || !description || !floorAreaSize
    || !pricePerMonth || !numberOfRooms || !location) {
    return validationError(res, 'Please provide all the required fields');
  }
  const { id: userId } = req.params;
  const { _id: callerId } = req.user;
  // Check that id is passed correctly and its a valid mongo ID
  if (!userId || !utils.validateObjectID(req.params.id)) return validationError(res, 'ID is not a valid mongo ObjectId');
  // Check if 3rd person's bookings are accessed
  if (userId !== callerId) {
    // Check if Admin is performing operation, otherwise return error
    if (!adminRole.includes(req.user.role)) return unauthorizedResponse(res, 'You don\'t have enough permissions');
  }
  // Make sure user has a Client role only
  try {
    const toUpdate = await UserSchema.findById({ _id: userId });
    if (!toUpdate) return notFoundResponse(res, 'Realtor was not found');
    if (nonRealtorRole.includes(toUpdate.role)) return validationError(res, 'The person who tried to add apartments is not realtor');
    // Create a new apartment
    const newApartment = new ApartmentSchema({
      name,
      description,
      floorAreaSize,
      pricePerMonth,
      numberOfRooms,
      loc: location,
      owner: userId,
      imageUrl,
    });
    // Assign this apartment to the realtor
    return newApartment.save((err, apartment) => {
      if (err) return next(err);
      return UserSchema.findByIdAndUpdate(
        userId, { $push: { ownedApartments: apartment._id } }, { new: true },
        (updateErr) => {
          if (updateErr) return next(err);
          return successResponseWithData(res, 'Apartment has added succesfully', {
            data: {
              apartmentId: apartment._id,
            },
          });
        },
      );
    });
  } catch (error) {
    return next(error);
  }
};

/*
* PUT /users/:id/apartments/:apartmentId
* Handle logic when a realtor is updating an existing apartment, or admin is updating it for realtor
*/

exports.updateApartment = async (req, res, next) => {
  const { apartmentId } = req.params;
  // Check if received ID is valid mongo ID
  if (!utils.validateObjectID(apartmentId)) return validationError(res, 'ApartmentId is not a valid mongo ObjectId');
  const {
    name, description, floorAreaSize, pricePerMonth, numberOfRooms, location,
    imageUrl,
  } = req.body;
  const { id: userId } = req.params;
  const { _id: callerId } = req.user;
  // Check that id is passed correctly and its a valid mongo ID
  if (!userId || !utils.validateObjectID(req.params.id)) return validationError(res, 'ID is not a valid mongo ObjectId');
  // Check if 3rd person's bookings are accessed
  if (userId !== callerId) {
    // Check if Admin is performing operation, otherwise return error
    if (!adminRole.includes(req.user.role)) return unauthorizedResponse(res, 'You don\'t have enough permissions');
  }
  try {
    const toUpdate = await ApartmentSchema.findById({ _id: apartmentId });
    if (!toUpdate) return notFoundResponse(res, 'Apartment was not found');
    // Check if apartment is under ownership of caller, or caller is admin
    if (toUpdate.owner !== userId && !adminRole.includes(req.user.role)) return unauthorizedResponse(res, 'Property ownership validation failed');
    if (name) toUpdate.name = name;
    if (description) toUpdate.description = description;
    if (floorAreaSize) toUpdate.floorAreaSize = floorAreaSize;
    if (pricePerMonth) toUpdate.pricePerMonth = pricePerMonth;
    if (numberOfRooms) toUpdate.numberOfRooms = numberOfRooms;
    if (location) toUpdate.loc = location;
    if (imageUrl) toUpdate.imageUrl = imageUrl;
    await toUpdate.save();
    return successResponseWithData(res, ' Apartment has succesfully updated', toUpdate);
  } catch (error) {
    return next(error);
  }
};

/*
* DELETE /users/:id/apartments/:apartmentId
* Handle logic when a realtor is deleting an existing apartment, or admin is deleting it for realtor
*/

exports.deleteApartment = async (req, res, next) => {
  const { id: userId } = req.params;
  const { _id: callerId } = req.user;
  const { apartmentId } = req.params;
  // Check if received ID is valid mongo ID
  if (!utils.validateObjectID(apartmentId)) return validationError(res, 'ApartmentId is not a valid mongo ObjectId');
  // Check that id is passed correctly and its a valid mongo ID
  if (!userId || !utils.validateObjectID(req.params.id)) return validationError(res, 'ID is not a valid mongo ObjectId');
  // Check if 3rd person's bookings are accessed
  if (userId !== callerId) {
    // Check if Admin is performing operation, otherwise return error
    if (!adminRole.includes(req.user.role)) return unauthorizedResponse(res, 'You don\'t have enough permissions');
  }
  try {
    const toDelete = await ApartmentSchema.findById({ _id: apartmentId });
    if (!toDelete) return notFoundResponse(res, 'Apartment was not found');
    // Check if apartment is under ownership of caller, or caller is admin
    if (toDelete.owner !== userId && !adminRole.includes(req.user.role)) return unauthorizedResponse(res, 'Property ownership validation failed');
    // Check if apartment is already booked
    if (!toDelete.isAvailable && toDelete.bookedBy) {
      await UserSchema.findByIdAndUpdate(
        { _id: toDelete.bookedBy }, { $pull: { bookings: apartmentId } },
      );
    }
    await toDelete.deleteOne();
    return successResponse(res, ' Apartment has succesfully deleted');
  } catch (error) {
    return next(error);
  }
};

/*
 * GET /users/:id/apartments'
 * Fetch all apartments of realtor
 */

exports.getOwnedApartments = async (req, res, next) => {
  const { id: userId } = req.params;
  const { _id: callerId } = req.user;
  // Check that id is passed correctly and its a valid mongo ID
  if (!userId || !utils.validateObjectID(req.params.id)) return validationError(res, 'ID is not a valid mongo ObjectId');
  // Check if 3rd person's bookings are accessed
  if (userId !== callerId) {
    // Check if Admin is performing operation, otherwise return error
    if (!adminRole.includes(req.user.role)) return unauthorizedResponse(res, 'You don\'t have enough permissions');
  }
  const { page = 1, pageSize = 10 } = req.query;
  const options = {
    sort: { createdAt: -1 },
    page,
    limit: pageSize,
  };
  return ApartmentSchema.paginate(
    { owner: userId },
    options,
    (err, results) => {
      if (err) return next(err);
      return successResponseWithData(res, 'Apartments fetched successfully', results);
    },
  );
};
