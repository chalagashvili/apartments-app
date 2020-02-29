const { successResponseWithData } = require('../services/apiResponse');
const ApartmentSchema = require('../models').apartmentSchema;

exports.findFilteredApartments = async (req, filterQuery) => {
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
  const results = await ApartmentSchema.paginate(filterQuery, options);
  results.metadata.page = Math.min(results.metadata.page, results.metadata.lastPage);
  return results;
};


/*
 * GET /apartments'
 * Fetch all available apartments
 */

exports.getAvailableApartments = async (req, res, next) => {
  try {
    const results = await this.findFilteredApartments(req, { isAvailable: true });
    return successResponseWithData(res, 'Apartments fetched successfully', results);
  } catch (error) {
    return next(error);
  }
};
