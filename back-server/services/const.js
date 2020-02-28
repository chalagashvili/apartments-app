exports.clientRole = ['client'];
exports.realtorRole = ['realtor'];
exports.adminRole = ['admin'];
exports.allRoles = [...this.adminRole, ...this.clientRole, ...this.realtorRole];
exports.regularRoles = [...this.clientRole, this.realtorRole];
exports.bookerRoles = [...this.adminRole, ...this.clientRole];
exports.apartmentRoles = [...this.adminRole, ...this.realtorRole];

exports.notEnoughPermissionsErrorText = 'You do not have enough permissions to perform operation';
exports.userWasNotFoundErrorText = 'User was not found';
exports.apartmentWasNotFoundErrorText = 'Apartment was not found';
exports.invalidMongoIdErrorText = 'Given ID is not a valid Mongo ID';
exports.invalidInputErrorText = 'Input is invalid';
