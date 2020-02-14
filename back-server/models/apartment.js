const moment = require('moment');
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const { Schema } = mongoose;

const apartmentSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  available: { type: Boolean, required: true },
  dateAdded: { type: Date, default: moment() },
  name: { type: String, required: true },
  description: { type: String, required: true },
  floorAreaSize: { type: Number, required: true },
  pricePerMonth: { type: Number, required: true },
  numberOfRooms: { type: Number, required: true },
  location: {
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
