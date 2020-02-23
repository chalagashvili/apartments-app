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

// eslint-disable-next-line no-use-before-define
const cleanUpAfterRoleChange = (doc) => removeLinkedDocuments(doc);

// eslint-disable-next-line no-use-before-define
userSchema.post('deleteOne', { document: true, query: false }, removeLinkedDocuments);

userSchema.plugin(mongoosePaginate);
const user = mongoose.model('User', userSchema);

function removeLinkedDocuments(doc) {
  if (doc.role === 'realtor') {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < doc.ownedApartments.length; i++) {
      const apartmentId = doc.ownedApartments[i];
      Apartment.findById({ _id: apartmentId }, (err, apart) => {
        if (!err && apart) {
          if (!apart.isAvailable) {
            user.findOneAndUpdate(
              { bookings: mongoose.Types.ObjectId(apartmentId) },
              { $pull: { bookings: apartmentId } },
            ).exec();
          }
          apart.remove();
        }
      });
    }
  } else if (doc.role === 'client') {
    Apartment.find({ _id: { $in: doc.bookings } }, (err, apartments) => {
      if (!err && apartments) {
        // eslint-disable-next-line no-plusplus
        for (let j = 0; j < apartments.length; j++) {
          const a = apartments[j];
          a.isAvailable = true;
          a.save();
        }
      }
    });
  }
}

module.exports = {
  user,
  cleanUpAfterRoleChange,
};
