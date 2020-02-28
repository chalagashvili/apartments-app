const { successResponseWithData } = require('../services/apiResponse');
const ApartmentSchema = require('../models').apartmentSchema;

exports.findFilteredApartments = (req, res, next) => {
  const { filterQuery } = res.locals;
  const {
    page = 1, pageSize = 10,
    floorAreaSizeFrom, floorAreaSizeTo,
    pricePerMonthFrom, pricePerMonthTo,
    numberOfRoomsFrom, numberOfRoomsTo,
    longitude, latitude, radius,
  } = req.query;
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
      return successResponseWithData(res, 'Apartments fetched successfully', results);
    },
  );
};


/*
 * GET /apartments'
 * Fetch all available apartments
 */

exports.getAvailableApartments = async (req, res, next) => {
  res.locals.filterQuery = { isAvailable: true };
  return this.findFilteredApartments(req, res, next);
};
