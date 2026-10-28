const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, 'Room number is required'],
      unique: true,
      trim: true
    },
    title: {
      type: String,
      required: [true, 'Room title is required'],
      trim: true
    },
    type: {
      type: String,
      required: true,
      enum: ['Standard', 'Deluxe', 'Executive Suite', 'Presidential Suite', 'Family Suite']
    },
    pricePerNight: {
      type: Number,
      required: [true, 'Price per night is required']
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      default: 2
    },
    bedType: {
      type: String,
      default: 'King Size'
    },
    sizeSqFt: {
      type: Number,
      default: 350
    },
    amenities: {
      type: [String],
      default: ['Free Wi-Fi', 'Air Conditioning', 'Flat-screen TV', 'Mini Bar', 'Room Service']
    },
    images: {
      type: [String],
      default: []
    },
    description: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Available', 'Booked', 'Maintenance'],
      default: 'Available'
    },
    rating: {
      type: Number,
      default: 4.8
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Room', roomSchema);
