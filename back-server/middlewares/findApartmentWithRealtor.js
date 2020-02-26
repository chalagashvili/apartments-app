const {
  notFoundResponse,
} = require('../services/apiResponse');
const { apartmentWasNotFoundErrorText } = require('../services/const');
const ApartmentSchema = require('../models').apartmentSchema;

exports.findApartmentWithRealtor = async (req, res, next) => {
  try {
    const { userId, apartmentId } = req.params;
    const apartment = await ApartmentSchema.findById({ _id: apartmentId, owner: userId });
    if (!apartment) return notFoundResponse(res, apartmentWasNotFoundErrorText);
    res.locals.apartment = apartment;
    return next();
  } catch (error) {
    throw new Error(error);
  }
};
