/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');
const crypto = require('crypto');
const { promisify } = require('util');
const utils = require('../services/utility');
const {
  errorResponse,
  successResponse,
  notFoundResponse,
  successResponseWithData,
} = require('../services/apiResponse');
const { cleanUpAfterRoleChange } = require('../models/user');

const {
  nonAdminRole,
} = require('../services/const');

const UserSchema = require('../models').userSchema;
const ApartmentSchema = require('../models').apartmentSchema;

const randomBytesAsync = promisify(crypto.randomBytes);

/*
 * DELETE /users/userId
 * Delete user account.
 */

exports.deleteUser = async (req, res, next) => {
  try {
    const toDelete = res.locals.user;
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

exports.addUser = async (req, res) => {
  const randomTokenBytes = await randomBytesAsync(16);
  const token = randomTokenBytes.toString('hex');
  const newUser = new UserSchema({
    ...req.body,
    password: utils.generatePassword(),
    passwordResetToken: token,
    passwordResetExpires: Date.now() + 3600000, // 1 hour
  });
  return newUser.save((err, user) => {
    if (err) return errorResponse(res, err.message);
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
    user.password = undefined;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    return utils.sendEmail(mailOptions)
      .then(() => successResponseWithData(res, `An e-mail has been sent to ${newUser.email} with further instructions.`, user))
      .catch(() => errorResponse(res, 'Password reset token has been generated but could not send an email'));
  });
};

/*
 * PUT /users/id
 * Update existing user
 */

exports.editUser = async (req, res, next) => {
  const { user } = res.locals;
  const { password, role } = req.body;
  /* Check if changing role, then we need to do some cleanup */
  if (user.role !== role) {
    cleanUpAfterRoleChange(user);
    user.bookings = [];
    user.ownedApartments = [];
  }
  const saveCb = (saveErr) => {
    if (saveErr) return next(saveErr);
    return successResponseWithData(res, 'User updated successfully', {
      data: [{
        name: user.name,
        role: user.role,
        email: user.email,
        createdAt: user.createdAt,
        _id: user._id,
      }],
    });
  };
  /* Check if changing password then fire .save to salt and
  hash new password instead of regular update */
  if (password) {
    return user.save(req.body, saveCb);
  }
  return UserSchema.findByIdAndUpdate({ _id: user._id }, req.body, { runValidators: true, context: 'query' }, saveCb);
};

/*
 * GET /users/id
 * Fetch existing user
 */

exports.getUser = async (req, res) => {
  const { user } = res.locals;
  const {
    name, role, email, createdAt, _id,
  } = user;
  return successResponseWithData(res, 'User fetched successfully', {
    data: [{
      name, role, email, createdAt, _id,
    },
    ],
  });
};

/*
 * GET /users
 * Fetch all users (excluding Admins)
 */

exports.getUsers = async (req, res, next) => {
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
      // eslint-disable-next-line no-param-reassign
      results.metadata.page = Math.min(results.metadata.page, results.metadata.lastPage);
      return successResponseWithData(res, 'Users fetched successfully', results);
    },
  );
};

/*
* GET /users/:id/bookings
* Handle logic when fetching specific user's bookings list
*/

exports.getBookings = (req, res, next) => {
  const { user } = res.locals;
  const {
    page = 1, pageSize = 10,
    floorAreaSizeFrom, floorAreaSizeTo,
    pricePerMonthFrom, pricePerMonthTo,
    numberOfRoomsFrom, numberOfRoomsTo,
    longitude, latitude, radius,
    isAvailable,
  } = req.query;
  const filterQuery = { _id: { $in: user.bookings } };
  if (floorAreaSizeFrom || floorAreaSizeTo) {
    filterQuery.floorAreaSize = {
      ...(floorAreaSizeFrom && { $gte: floorAreaSizeFrom }),
      ...(floorAreaSizeTo && { $lte: floorAreaSizeTo }),
    };
  }
  if (pricePerMonthFrom || pricePerMonthTo) {
    filterQuery.pricePerMonth = {
      ...(pricePerMonthFrom && { $gte: pricePerMonthFrom }),
      ...(pricePerMonthTo && { $lte: pricePerMonthTo }),
    };
  }
  if (numberOfRoomsFrom || numberOfRoomsTo) {
    filterQuery.numberOfRooms = {
      ...(numberOfRoomsFrom && { $gte: numberOfRoomsFrom }),
      ...(numberOfRoomsTo && { $lte: numberOfRoomsTo }),
    };
  }
  if (longitude && latitude && radius) {
    filterQuery.loc = {
      $geoWithin: { $centerSphere: [[longitude, latitude], radius] },
    };
  }
  if (isAvailable != null) {
    filterQuery.isAvailable = isAvailable;
  }
  const options = {
    sort: { createdAt: -1 },
    page,
    populate: { path: 'owner', select: 'name email id' },
    limit: pageSize,
  };
  return ApartmentSchema.paginate(
    filterQuery,
    options,
    (err, results) => {
      if (err) return next(err);
      // eslint-disable-next-line no-param-reassign
      results.metadata.page = Math.min(results.metadata.page, results.metadata.lastPage);
      return successResponseWithData(res, 'Bookings fetched successfully', results);
    },
  );
};

/*
* POST /users/:id/bookings/:apartmentId
* Handle logic when a user is booking an apartment, or admin is renting for a user
*/

exports.bookApartment = async (req, res, next) => {
  const { user, apartment } = res.locals.user;
  try {
    apartment.isAvailable = false;
    await apartment.save();
    await UserSchema.findByIdAndUpdate(
      user._id, { $push: { bookings: apartment._id } },
    );
    apartment.owner = undefined;
    return successResponseWithData(res, 'Apartment has booked succesfully', { data: { apartment } });
  } catch (error) {
    return next(error);
  }
};

/*
* DELETE /users/:id/bookings/:apartId
* Handle logic when a user is unbooking an apartment, or admin is unbooking it for a user
*/

exports.unbookApartment = async (req, res, next) => {
  const { user, apartment } = res.locals;
  try {
    apartment.isAvailable = true;
    await apartment.save();
    await UserSchema.findByIdAndUpdate(user._id, { $pull: { bookings: apartment._id } });
    return successResponseWithData(res, 'Apartment has unbooked succesfully', { data: { apartmentId: apartment._id } });
  } catch (error) {
    return next(error);
  }
};

/*
* POST /users/:id/apartments
* Handle logic when a realtor is adding a new apartment, or admin is adding it for realtor
*/

exports.addApartment = async (req, res, next) => {
  const { userId } = req.params;
  const toUpdate = res.locals.user;
  // Create a new apartment
  const newApartment = new ApartmentSchema({ ...req.body, owner: toUpdate._id });
  // Assign this apartment to the realtor
  return newApartment.save((err, apartment) => {
    if (err) return next(err);
    return UserSchema.findByIdAndUpdate(
      userId, { $push: { ownedApartments: apartment._id } }, { new: true },
      (updateErr) => {
        if (updateErr) return next(err);
        return successResponseWithData(res, 'Apartment has added succesfully', {
          data: {
            apartment,
          },
        });
      },
    );
  });
};

/*
* PUT /users/:id/apartments/:apartmentId
* Handle logic when a realtor is updating an existing apartment, or admin is updating it for realtor
*/

exports.updateApartment = async (req, res, next) => {
  const { apartmentId } = req.params;
  try {
    const toUpdate = res.locals.apartment;
    // if changing availability of the apartment to TRUE
    // we should also remove it from client's bookings, if it exists
    if (toUpdate.isAvailable === false && req.body.isAvailable === true) {
      await UserSchema.findOneAndUpdate(
        { bookings: mongoose.Types.ObjectId(apartmentId) }, { $pull: { bookings: apartmentId } },
      );
    }
    await ApartmentSchema.findOneAndUpdate({ _id: apartmentId }, req.body);
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
  const { apartmentId } = req.params;
  try {
    const toDelete = res.locals.apartment;
    if (!toDelete.isAvailable) {
      // Remove from user's bookings
      await UserSchema.findOneAndUpdate(
        { bookings: mongoose.Types.ObjectId(apartmentId) }, { $pull: { bookings: apartmentId } },
      );
    }
    // Remove apartment from realtor's apartments
    await UserSchema.findOneAndUpdate(
      { ownedApartments: mongoose.Types.ObjectId(apartmentId) },
      { $pull: { ownedApartments: apartmentId } },
    );
    // Delete apartment itself
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
  const { userId } = req.params;
  const {
    page = 1, pageSize = 10,
    floorAreaSizeFrom, floorAreaSizeTo,
    pricePerMonthFrom, pricePerMonthTo,
    numberOfRoomsFrom, numberOfRoomsTo,
    longitude, latitude, radius,
    isAvailable,
  } = req.query;
  const filterQuery = { owner: userId };
  if (floorAreaSizeFrom || floorAreaSizeTo) {
    filterQuery.floorAreaSize = {
      ...(floorAreaSizeFrom && { $gte: floorAreaSizeFrom }),
      ...(floorAreaSizeTo && { $lte: floorAreaSizeTo }),
    };
  }
  if (pricePerMonthFrom || pricePerMonthTo) {
    filterQuery.pricePerMonth = {
      ...(pricePerMonthFrom && { $gte: pricePerMonthFrom }),
      ...(pricePerMonthTo && { $lte: pricePerMonthTo }),
    };
  }
  if (numberOfRoomsFrom || numberOfRoomsTo) {
    filterQuery.numberOfRooms = {
      ...(numberOfRoomsFrom && { $gte: numberOfRoomsFrom }),
      ...(numberOfRoomsTo && { $lte: numberOfRoomsTo }),
    };
  }
  if (longitude && latitude && radius) {
    filterQuery.loc = {
      $geoWithin: { $centerSphere: [[longitude, latitude], radius] },
    };
  }
  if (isAvailable != null) {
    filterQuery.isAvailable = isAvailable;
  }
  const options = {
    sort: { createdAt: -1 },
    populate: { path: 'owner', select: 'name email id' },
    page,
    limit: pageSize,
  };
  return ApartmentSchema.paginate(
    filterQuery,
    options,
    (err, results) => {
      if (err) return next(err);
      // eslint-disable-next-line no-param-reassign
      results.metadata.page = Math.min(results.metadata.page, results.metadata.lastPage);
      return successResponseWithData(res, 'Apartments fetched successfully', results);
    },
  );
};

/*
 * GET /users/:id/apartments/:apartmentId'
 * Fetch specific apartment of realtor
 */
exports.getSingleApartment = (req, res, next) => {
  const { apartmentId } = req.params;
  return ApartmentSchema.findById({ _id: apartmentId }, (err, apartment) => {
    if (err) return next(err);
    if (!apartment) return notFoundResponse(res, 'No apartment found for that id');
    return successResponseWithData(res, 'Apartment found successfully', apartment);
  });
};
