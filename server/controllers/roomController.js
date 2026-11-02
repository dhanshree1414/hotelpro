const Room = require('../models/Room');
const Booking = require('../models/Booking');
const store = require('../data/store');

// @desc    Get all rooms with filtering, search & availability check
// @route   GET /api/rooms
// @access  Public
const getRooms = async (req, res) => {
  try {
    const { type, minPrice, maxPrice, capacity, checkIn, checkOut, search } = req.query;

    if (global.isMongoConnected) {
      let query = {};

      if (type && type !== 'All') {
        query.type = type;
      }

      if (minPrice || maxPrice) {
        query.pricePerNight = {};
        if (minPrice) query.pricePerNight.$gte = Number(minPrice);
        if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
      }

      if (capacity) {
        query.capacity = { $gte: Number(capacity) };
      }

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { roomNumber: { $regex: search, $options: 'i' } }
        ];
      }

      let rooms = await Room.find(query);

      if (checkIn && checkOut) {
        const inDate = new Date(checkIn);
        const outDate = new Date(checkOut);

        const overlappingBookings = await Booking.find({
          bookingStatus: { $in: ['Confirmed', 'Checked-In'] },
          $or: [
            { checkInDate: { $lt: outDate }, checkOutDate: { $gt: inDate } }
          ]
        });

        const bookedRoomIds = overlappingBookings.map((b) => b.room.toString());
        rooms = rooms.filter((room) => !bookedRoomIds.includes(room._id.toString()));
      }

      return res.json(rooms);
    } else {
      const rooms = store.getRooms({ type, minPrice, maxPrice, capacity, checkIn, checkOut, search });
      return res.json(rooms);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single room by ID
// @route   GET /api/rooms/:id
// @access  Public
const getRoomById = async (req, res) => {
  try {
    if (global.isMongoConnected) {
      const room = await Room.findById(req.params.id);
      if (room) {
        return res.json(room);
      }
      return res.status(404).json({ message: 'Room not found' });
    } else {
      const room = store.getRoomById(req.params.id);
      if (room) {
        return res.json(room);
      }
      return res.status(404).json({ message: 'Room not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new room
// @route   POST /api/rooms
// @access  Private/Admin
const createRoom = async (req, res) => {
  try {
    if (global.isMongoConnected) {
      const room = new Room(req.body);
      const createdRoom = await room.save();
      return res.status(201).json(createdRoom);
    } else {
      const createdRoom = store.createRoom(req.body);
      return res.status(201).json(createdRoom);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update room details
// @route   PUT /api/rooms/:id
// @access  Private/Admin
const updateRoom = async (req, res) => {
  try {
    if (global.isMongoConnected) {
      const room = await Room.findById(req.params.id);
      if (room) {
        Object.assign(room, req.body);
        const updatedRoom = await room.save();
        return res.json(updatedRoom);
      }
      return res.status(404).json({ message: 'Room not found' });
    } else {
      const updatedRoom = store.updateRoom(req.params.id, req.body);
      if (updatedRoom) {
        return res.json(updatedRoom);
      }
      return res.status(404).json({ message: 'Room not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a room
// @route   DELETE /api/rooms/:id
// @access  Private/Admin
const deleteRoom = async (req, res) => {
  try {
    if (global.isMongoConnected) {
      const room = await Room.findById(req.params.id);
      if (room) {
        await Room.deleteOne({ _id: room._id });
        return res.json({ message: 'Room removed successfully' });
      }
      return res.status(404).json({ message: 'Room not found' });
    } else {
      const success = store.deleteRoom(req.params.id);
      if (success) {
        return res.json({ message: 'Room removed successfully' });
      }
      return res.status(404).json({ message: 'Room not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRooms, getRoomById, createRoom, updateRoom, deleteRoom };
