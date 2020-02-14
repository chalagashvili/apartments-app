const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const mongoosePaginate = require('mongoose-paginate');
const Apartment = require('./apartment');

const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, unique: true },
  role: { type: String, default: 'client', enum: ['client', 'realtor', 'admin'] },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  name: String,
  rentedApartments: [{ type: Schema.Types.ObjectId, ref: 'Apartment' }],
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
    console.log(doc, 'removing all realtor apartments');
    Apartment.deleteMany({ _id: { $in: doc.ownedApartments } });
  } else if (doc.role === 'client') {
    console.log(doc, 'freeing up all apartments taken by this client');
    Apartment.updateMany({ _id: { $in: doc.ownedApartments } }, { $set: { available: true } });
  }
}

userSchema.post('remove', removeLinkedDocuments);
userSchema.post('deleteOne', { document: true, query: false }, removeLinkedDocuments);

userSchema.plugin(mongoosePaginate);
const user = mongoose.model('User', userSchema);

module.exports = user;
