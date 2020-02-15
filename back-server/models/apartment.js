const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

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
  isAvailable: { type: Boolean, default: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  floorAreaSize: { type: Number, required: true },
  pricePerMonth: { type: Number, required: true },
  numberOfRooms: { type: Number, required: true },
  imageUrl: { type: String },
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
});

apartmentSchema.index({ location: '2dsphere' });

apartmentSchema.plugin(mongoosePaginate);
const apartment = mongoose.model('Apartment', apartmentSchema);

module.exports = apartment;
