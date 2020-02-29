const Int32 = require('mongoose-int32');
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const UserSchema = require('./user').user;

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

const apartmentSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  isAvailable: { type: Boolean, default: false, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  floorAreaSize: { type: Number, required: true, min: 0 },
  pricePerMonth: { type: Number, required: true, min: 0 },
  numberOfRooms: { type: Int32, required: true, min: 0 },
  loc: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
}, { timestamps: true });

apartmentSchema.pre('findOneAndUpdate', function (next) {
  this.options.runValidators = true;
  next();
});

apartmentSchema.post('deleteOne', { document: true, query: false }, async (doc) => {
  try {
    const apartmentId = doc._id;
    await UserSchema.updateMany({ bookings: apartmentId }, { $pull: { bookings: apartmentId } });
  } catch (error) {
    console.error(error);
  }
});

apartmentSchema.index({ loc: '2dsphere' });

apartmentSchema.plugin(mongoosePaginate);
const apartment = mongoose.model('Apartment', apartmentSchema);

module.exports = apartment;
