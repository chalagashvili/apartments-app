const {
  successResponseWithData,
  unauthorizedResponse,
} = require('../services/apiResponse');
const {
  nonRealtorRole,
} = require('../services/const');
const ApartmentSchema = require('../models').apartmentSchema;

/*
 * GET /apartments'
 * Fetch all available apartments
 */

exports.getAvailableApartments = async (req, res, next) => {
  // Make sure realtors cant access this API
  if (!nonRealtorRole.includes(req.user.role)) return unauthorizedResponse(res, 'You don\'t have enough permissions');
  const {
    page = 1, pageSize = 10,
    floorAreaSizeFrom, floorAreaSizeTo,
    pricePerMonthFrom, pricePerMonthTo,
    numberOfRoomsFrom, numberOfRoomsTo,
    longitude, latitude, radius,
  } = req.query;
  const filterQuery = {
    isAvailable: true,
  };
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
  const options = {
    sort: { createdAt: -1 },
    page,
    populate: 'owner',
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
