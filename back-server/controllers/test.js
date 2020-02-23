const UserSchema = require('../models').userSchema;
const ApartmentSchema = require('../models').apartmentSchema;
const { successResponse } = require('../services/apiResponse');

exports.resetDatabase = async (req, res) => {
  await UserSchema.deleteMany({});
  await ApartmentSchema.deleteMany({});
  const realtorUser = new UserSchema({
    email: 'good@realtor.com',
    role: 'realtor',
    name: 'Good Realtor',
    password: '12345678',
  });
  await realtorUser.save();
  const adminUser = new UserSchema({
    email: 'good@admin.com',
    role: 'admin',
    name: 'Good Admin',
    password: '12345678',
  });
  await adminUser.save();
  return successResponse(res, 'Database is cleared successfully');
};
