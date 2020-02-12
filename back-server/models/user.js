import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
import moment from 'moment';
import mongoosePaginate from 'mongoose-paginate';

const { Schema } = mongoose;

// const userSchema = new Schema({
//   email: { type: String, unique: true },
//   password: { type: String },
//   createdAt: { type: Date, default: new Date() },
//   assets: [{ type: Schema.Types.ObjectId, ref: 'Asset' }]
// });

const userSchema = new Schema({
  email: { type: String, unique: true },
  role: { type: String, default: 'regular' },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailVerificationToken: String,
  emailVerified: Boolean,
  createdAt: { type: Date, default: moment() },

  facebook: String,
  google: String,
  github: String,
  tokens: Array,

  profile: {
    name: String,
    bio: String,
    picture: String,
  },
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

userSchema.plugin(mongoosePaginate);
const user = mongoose.model('User', userSchema);

module.exports = user;
