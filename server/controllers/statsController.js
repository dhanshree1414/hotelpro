const Booking = require('../models/Booking');
const Room = require('../models/Room');
const User = require('../models/User');
const store = require('../data/store');

// @desc    Get dashboard metrics & statistics
// @route   GET /api/stats/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    if (global.isMongoConnected) {
      const totalRooms = await Room.countDocuments();
      const totalGuests = await User.countDocuments({ role: 'guest' });
      const totalBookings = await Booking.countDocuments();

      const confirmedBookings = await Booking.countDocuments({
        bookingStatus: { $in: ['Confirmed', 'Checked-In'] }
      });

      const revenueResult = await Booking.aggregate([
        { $match: { bookingStatus: { $ne: 'Cancelled' } } },
        { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
      ]);
      const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

      const occupancyRate = totalRooms > 0 ? Math.min(100, Math.round((confirmedBookings / totalRooms) * 100)) : 0;

      const recentBookings = await Booking.find({})
        .populate('user', 'name email')
        .populate('room', 'title roomNumber pricePerNight')
        .sort({ createdAt: -1 })
        .limit(6);

      return res.json({
        totalRooms,
        totalGuests,
        totalBookings,
        confirmedBookings,
        occupancyRate,
        totalRevenue,
        recentBookings
      });
    } else {
      const stats = store.getDashboardStats();
      return res.json(stats);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
