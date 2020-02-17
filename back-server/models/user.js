const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const mongoosePaginate = require('mongoose-paginate-v2');
const Apartment = require('./apartment');

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
  email: { type: String, unique: true },
  role: { type: String, default: 'client', enum: ['client', 'realtor', 'admin'] },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  name: String,
  bookings: [{ type: Schema.Types.ObjectId, ref: 'Apartment' }],
  ownedApartments: [{ type: Schema.Types.ObjectId, ref: 'Apartment' }],
}, { timestamps: true });

// Pre-save hook for hashing + salting with password
// eslint-disable-next-line func-names
userSchema.pre('save', function (next) {
  const user = this;
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    return bcrypt.hash(user.password, salt, null, (hashErr, hash) => {
      if (hashErr) {
        return next(hashErr);
      }
      user.password = hash;
      return next();
    });
  });
});

// Compare provided password with salted one
// eslint-disable-next-line func-names
userSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) {
      return callback(err);
    }
    return callback(null, isMatch);
  });
};

function removeLinkedDocuments(doc) {
  if (doc.role === 'realtor') {
    Apartment.deleteMany({ _id: { $in: doc.ownedApartments } });
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < doc.ownedApartments.length; i++) {
      const apartmentId = doc.ownedApartments[i];
      Apartment.findById({ _id: apartmentId }, (err, apart) => {
        if (!err) {
          if (!apart.isAvailable && apart.bookedBy) {
            userSchema.findByIdAndUpdate(
              { _id: apart.bookedBy }, { $pull: { bookings: apartmentId } },
            );
          }
        }
      });
    }
  } else if (doc.role === 'client') {
    Apartment.updateMany(
      { _id: { $in: doc.bookings } }, { $set: { available: true, bookedBy: null } },
    );
  }
}

exports.cleanUpAfterRoleChange = (doc) => removeLinkedDocuments(doc);

userSchema.post('deleteOne', { document: true, query: false }, removeLinkedDocuments);

userSchema.plugin(mongoosePaginate);
const user = mongoose.model('User', userSchema);

module.exports = user;
