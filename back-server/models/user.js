const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const mongoosePaginate = require('mongoose-paginate-v2');
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');
const { allRoles, clientRole, realtorRole } = require('../services/const');

const customLabels = {
  totalDocs: 'totalItems',
  docs: 'data',
  limit: 'pageSize',
  page: 'page',
  nextPage: 'next',
  prevPage: 'prev',
  totalPages: 'lastPage',
  pagingCounter: 'slNo',
  meta: 'metadata',
};

mongoosePaginate.paginate.options = {
  lean: true,
  leanWithId: false,
  customLabels,
};

const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    trim: true,
    uniqueCaseInsensitive: true,
    validate: {
      validator: validator.isEmail,
      message: 'Email is invalid',
      isAsync: false,
    },
  },
  role: { type: String, default: 'client', enum: allRoles },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  name: String,
  bookings: [{ type: Schema.Types.ObjectId, ref: 'Apartment' }],
  ownedApartments: [{ type: Schema.Types.ObjectId, ref: 'Apartment' }],
}, { timestamps: true });

userSchema.pre('findOneAndUpdate', function (next) {
  this.options.runValidators = true;
  next();
});

// Pre-save hook for hashing + salting with password
userSchema.pre(['save', 'updateOne'], async function (next) {
  try {
    const user = this;
    const { _update = {} } = this;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(_update.password || user.password, salt);
    user.password = hash;
    _update.password = hash;
    next();
  } catch (error) {
    next(error);
  }
});

// Compare provided password with salted one
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    const match = await bcrypt.compare(candidatePassword, this.password);
    return match;
  } catch (error) {
    throw new Error(error);
  }
};

// eslint-disable-next-line no-use-before-define
const cleanUpAfterRoleChange = (doc) => removeLinkedDocuments(doc);

// eslint-disable-next-line no-use-before-define
userSchema.post('deleteOne', { document: true, query: false }, removeLinkedDocuments);

// Apply pagination plugin to userSchema
userSchema.plugin(mongoosePaginate);
// Apply the uniqueValidator plugin to userSchema.
userSchema.plugin(uniqueValidator, { message: 'Email address is already used.' });
const user = mongoose.model('User', userSchema);

module.exports = {
  user,
  cleanUpAfterRoleChange,
};

const ApartmentSchema = require('./apartment');

async function removeLinkedDocuments(doc) {
  try {
    if (realtorRole.includes(doc.role)) {
      user.updateMany(
        { bookings: { $in: doc.ownedApartments } },
        { $pull: { bookings: { $in: doc.ownedApartments } } }, { multi: true },
      ).exec();
      ApartmentSchema.deleteMany({ _id: { $in: doc.ownedApartments } }).exec();
    } else if (clientRole.includes(doc.role)) {
      ApartmentSchema.updateMany({ _id: { $in: doc.bookings } }, { isAvailable: true }).exec();
    }
  } catch (error) {
    console.error(error);
  }
}
