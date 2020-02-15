const {
  errorResponse,
  validationError,
  successResponse,
  notFoundResponse,
  unauthorizedResponse,
  successResponseWithData,
} = require('../services/apiResponse');
const { adminRole, nonAdminRole, allRoles } = require('../services/const');
const ApartmentSchema = require('../models').apartmentSchema;

exports.getApartments = (req, res, next) => {
  // Check if Admin is performing fetch, otherwise return error
  if (!adminRole.includes(req.user.role)) return unauthorizedResponse(res, 'You don\'t have enough permissions');
  const { page = 1, pageSize = 10 } = req.query;
  const options = {
    select: 'createdAt name email role',
    sort: { createdAt: -1 },
    page,
    limit: pageSize,
  };
  return ApartmentSchema.paginate(
    { role: { $in: nonAdminRole } },
    options,
    (err, results) => {
      if (err) return next(err);
      return successResponseWithData(res, 'Users fetched successfully', results);
    },
  );
};
