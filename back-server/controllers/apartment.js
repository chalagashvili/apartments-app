const {
  successResponseWithData,
} = require('../services/apiResponse');
const ApartmentSchema = require('../models').apartmentSchema;

/*
 * GET /apartments'
 * Fetch all available apartments
 */

exports.getAvailableApartments = async (req, res, next) => {
  const {
    page = 1, pageSize = 10,
    floorAreaSizeFrom, floorAreaSizeTo,
    pricePerMonthFrom, pricePerMonthTo,
    numberOfRoomsFrom, numberOfRoomsTo,
  } = req.query;
  const filterQuery = {};
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
  const options = {
    sort: { createdAt: -1 },
    page,
    limit: pageSize,
  };
  return ApartmentSchema.paginate(
    filterQuery,
    options,
    (err, results) => {
      if (err) return next(err);
      return successResponseWithData(res, 'Apartments fetched successfully', results);
    },
  );
};
