const Booking = require('../models/Booking');
const Room = require('../models/Room');
const store = require('../data/store');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const {
      roomId,
      guestName,
      guestEmail,
      guestPhone,
      checkInDate,
      checkOutDate,
      specialRequests,
      paymentMethod
    } = req.body;

    const inDate = new Date(checkInDate);
    const outDate = new Date(checkOutDate);

    if (inDate >= outDate) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }

    if (global.isMongoConnected) {
      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }

      const conflicting = await Booking.findOne({
        room: roomId,
        bookingStatus: { $in: ['Confirmed', 'Checked-In'] },
        $or: [
          { checkInDate: { $lt: outDate }, checkOutDate: { $gt: inDate } }
        ]
      });

      if (conflicting) {
        return res.status(400).json({ message: 'Room is already booked for the selected dates' });
      }

      const diffTime = Math.abs(outDate - inDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const totalNights = diffDays || 1;
      const totalAmount = totalNights * room.pricePerNight;

      const booking = new Booking({
        user: req.user._id,
        room: roomId,
        guestName: guestName || req.user.name,
        guestEmail: guestEmail || req.user.email,
        guestPhone: guestPhone || req.user.phone || '',
        checkInDate: inDate,
        checkOutDate: outDate,
        totalNights,
        totalAmount,
        specialRequests: specialRequests || '',
        paymentStatus: 'Paid',
        paymentMethod: paymentMethod || 'Card Simulation',
        bookingStatus: 'Confirmed'
      });

      const createdBooking = await booking.save();
      const populated = await Booking.findById(createdBooking._id).populate('room');
      return res.status(201).json(populated);
    } else {
      const room = store.getRoomById(roomId);
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }

      const allBookings = store.getAllBookings();
      const conflicting = allBookings.find((b) => {
        const bRoomId = typeof b.room === 'object' ? b.room?._id : b.room;
        if (bRoomId !== roomId) return false;
        if (!['Confirmed', 'Checked-In'].includes(b.bookingStatus)) return false;
        const bIn = new Date(b.checkInDate);
        const bOut = new Date(b.checkOutDate);
        return bIn < outDate && bOut > inDate;
      });

      if (conflicting) {
        return res.status(400).json({ message: 'Room is already booked for the selected dates' });
      }

      const diffTime = Math.abs(outDate - inDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const totalNights = diffDays || 1;
      const totalAmount = totalNights * room.pricePerNight;

      const createdBooking = store.createBooking({
        user: req.user._id,
        room: roomId,
        guestName: guestName || req.user.name,
        guestEmail: guestEmail || req.user.email,
        guestPhone: guestPhone || req.user.phone || '',
        checkInDate: inDate.toISOString(),
        checkOutDate: outDate.toISOString(),
        totalNights,
        totalAmount,
        specialRequests: specialRequests || '',
        paymentStatus: 'Paid',
        paymentMethod: paymentMethod || 'Card Simulation',
        bookingStatus: 'Confirmed'
      });

      return res.status(201).json(createdBooking);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    if (global.isMongoConnected) {
      const bookings = await Booking.find({ user: req.user._id })
        .populate('room')
        .sort({ createdAt: -1 });
      return res.json(bookings);
    } else {
      const bookings = store.getBookingsByUser(req.user._id);
      return res.json(bookings);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    if (global.isMongoConnected) {
      const bookings = await Booking.find({})
        .populate('user', 'name email')
        .populate('room')
        .sort({ createdAt: -1 });
      return res.json(bookings);
    } else {
      const bookings = store.getAllBookings();
      return res.json(bookings);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status (Admin)
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = async (req, res) => {
  try {
    const { bookingStatus, paymentStatus } = req.body;

    if (global.isMongoConnected) {
      const booking = await Booking.findById(req.params.id);
      if (booking) {
        if (bookingStatus) booking.bookingStatus = bookingStatus;
        if (paymentStatus) booking.paymentStatus = paymentStatus;
        const updated = await booking.save();
        const populated = await Booking.findById(updated._id).populate('room').populate('user', 'name email');
        return res.json(populated);
      }
      return res.status(404).json({ message: 'Booking not found' });
    } else {
      const updated = store.updateBookingStatus(req.params.id, { bookingStatus, paymentStatus });
      if (updated) {
        return res.json(updated);
      }
      return res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel user booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    if (global.isMongoConnected) {
      const booking = await Booking.findById(req.params.id);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to cancel this booking' });
      }

      booking.bookingStatus = 'Cancelled';
      const updated = await booking.save();
      return res.json(updated);
    } else {
      const booking = store.getBookingById(req.params.id);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      const bookingUserId = typeof booking.user === 'object' ? booking.user?._id : booking.user;
      if (bookingUserId !== req.user._id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to cancel this booking' });
      }

      const updated = store.updateBookingStatus(req.params.id, { bookingStatus: 'Cancelled' });
      return res.json(updated);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  cancelBooking
};
