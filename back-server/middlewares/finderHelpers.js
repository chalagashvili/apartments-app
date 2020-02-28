const UserSchema = require('../models').userSchema;
const ApartmentSchema = require('../models').apartmentSchema;
const { notFoundResponse, unauthorizedResponse } = require('../services/apiResponse');
const { apartmentWasNotFoundErrorText, userWasNotFoundErrorText, notEnoughPermissionsErrorText } = require('../services/const');

exports.findApartmentWithClient = async (req, res, next) => {
  try {
    const { apartmentId } = req.params;
    const { user } = res.locals;
    const apartment = await ApartmentSchema.findOne({
      $and: [{ _id: apartmentId },
        { _id: { $in: user.bookings } }],
    });
    if (!apartment) return notFoundResponse(res, apartmentWasNotFoundErrorText);
    res.locals.apartment = apartment;
    return next();
  } catch (error) {
    throw new Error(error);
  }
};

exports.findApartmentWithRealtor = async (req, res, next) => {
  try {
    const { userId, apartmentId } = req.params;
    const apartment = await ApartmentSchema.findOne({ _id: apartmentId, owner: userId });
    if (!apartment) return notFoundResponse(res, apartmentWasNotFoundErrorText);
    res.locals.apartment = apartment;
    return next();
  } catch (error) {
    throw new Error(error);
  }
};

exports.findAvailableApartment = async (req, res, next) => {
  try {
    const { apartmentId } = req.params;
    const apartment = await ApartmentSchema.findOne({ _id: apartmentId, isAvailable: true });
    if (!apartment) return notFoundResponse(res, apartmentWasNotFoundErrorText);
    res.locals.apartment = apartment;
    return next();
  } catch (error) {
    throw new Error(error);
  }
};

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
