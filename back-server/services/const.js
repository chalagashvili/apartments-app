exports.allRoles = ['client', 'realtor', 'admin'];
exports.clientRole = ['client', 'realtor', 'admin'];
exports.realtorRole = ['realtor', 'admin'];
exports.adminRole = ['admin'];
exports.nonAdminRole = ['client', 'realtor'];
exports.nonClientRole = ['realtor', 'admin'];
exports.nonRealtorRole = ['client', 'admin'];
exports.realtorOnlyRole = ['realtor'];

exports.notEnoughPermissionsErrorText = 'You do not have enough permissions to perform operation';
exports.userWasNotFoundErrorText = 'User was not found';
exports.apartmentWasNotFoundErrorText = 'Apartment was not found';
exports.invalidMongoIdErrorText = 'Given ID is not a valid Mongo ID';
exports.invalidInputErrorText = 'Input is invalid';
