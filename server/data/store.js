const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_FILE = path.join(__dirname, 'db.json');

const defaultRooms = [
  {
    _id: 'room101',
    roomNumber: '101',
    title: 'Grand Deluxe King Room',
    type: 'Deluxe',
    pricePerNight: 180,
    capacity: 2,
    bedType: '1 King Bed',
    sizeSqFt: 420,
    amenities: ['Free High-Speed Wi-Fi', 'City Skyline View', 'Air Conditioning', '4K Smart TV', 'Espresso Machine', 'Marble Bathroom', '24/7 Room Service'],
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Immerse yourself in supreme comfort with panoramic city views, custom Italian furnishings, and plush Egyptian cotton linens.',
    status: 'Available',
    rating: 4.9,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'room102',
    roomNumber: '102',
    title: 'Executive Sea-Facing Suite',
    type: 'Executive Suite',
    pricePerNight: 290,
    capacity: 3,
    bedType: '1 King Bed + 1 Sofa Bed',
    sizeSqFt: 650,
    amenities: ['Oceanfront Balcony', 'Free Wi-Fi', 'Jacuzzi Tub', 'Complimentary Breakfast', 'Mini Bar', 'Workstation', 'Soundproof Windows'],
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'A spacious sanctuary featuring an ocean-view private balcony, separate living lounge, and deep-soaking hydrotherapy tub.',
    status: 'Available',
    rating: 4.95,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'room103',
    roomNumber: '103',
    title: 'Cozy Urban Standard Room',
    type: 'Standard',
    pricePerNight: 95,
    capacity: 2,
    bedType: '1 Queen Bed',
    sizeSqFt: 300,
    amenities: ['High-Speed Wi-Fi', 'Air Conditioning', 'Flat-screen TV', 'Rain Shower', 'Complimentary Bottled Water'],
    images: [
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Designed for modern travelers and business professionals, offering ergonomic work essentials and peaceful quiet.',
    status: 'Available',
    rating: 4.7,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'room201',
    roomNumber: '201',
    title: 'Royal Presidential Penthouse',
    type: 'Presidential Suite',
    pricePerNight: 550,
    capacity: 4,
    bedType: '2 King Beds',
    sizeSqFt: 1200,
    amenities: ['Private Rooftop Terrace', 'Personal Butler Service', 'Infinity Plunge Pool', 'Gourmet Kitchenette', 'Home Theater', 'Walk-in Closet'],
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'The pinnacle of luxury hospitality. Spanning 1,200 sq ft of bespoke indulgence with personal butler and private rooftop terrace.',
    status: 'Available',
    rating: 5.0,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'room202',
    roomNumber: '202',
    title: 'Family Garden Oasis Suite',
    type: 'Family Suite',
    pricePerNight: 220,
    capacity: 5,
    bedType: '2 Queen Beds + 1 Daybed',
    sizeSqFt: 780,
    amenities: ['Direct Garden Access', 'Kids Play Area Corner', 'Free High-Speed Wi-Fi', 'Mini Refrigerator', 'Microwave', 'Twin Vanities'],
    images: [
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Perfect for family vacations. Offers direct access to tranquil courtyard gardens and spacious interconnected sleeping zones.',
    status: 'Available',
    rating: 4.85,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'room203',
    roomNumber: '203',
    title: 'Modern Classic Double Room',
    type: 'Standard',
    pricePerNight: 110,
    capacity: 2,
    bedType: '2 Twin Beds',
    sizeSqFt: 340,
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Electronic Safe', 'Tea & Coffee Maker', 'Ironing Facilities'],
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Clean lines, comfortable twin beds, and soothing ambiance tailored for friends or colleagues sharing a retreat.',
    status: 'Available',
    rating: 4.65,
    createdAt: new Date().toISOString()
  }
];

let state = {
  users: [],
  rooms: defaultRooms,
  bookings: []
};

// Seed initial users with hashed passwords
const initUsers = async () => {
  const adminPass = await bcrypt.hash('adminpassword123', 10);
  const guestPass = await bcrypt.hash('guestpassword123', 10);

  state.users = [
    {
      _id: 'user_admin_001',
      name: 'HotelPro Admin',
      email: 'admin@hotelpro.com',
      password: adminPass,
      phone: '+1 (555) 019-2834',
      role: 'admin',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'user_guest_002',
      name: 'John Guest',
      email: 'guest@hotelpro.com',
      password: guestPass,
      phone: '+1 (555) 782-9901',
      role: 'guest',
      createdAt: new Date().toISOString()
    }
  ];

  // Seed 1 initial booking
  const checkIn = new Date();
  checkIn.setDate(checkIn.getDate() + 2);
  const checkOut = new Date();
  checkOut.setDate(checkOut.getDate() + 5);

  state.bookings = [
    {
      _id: 'book_sample_001',
      user: 'user_guest_002',
      room: 'room101',
      guestName: 'John Guest',
      guestEmail: 'guest@hotelpro.com',
      guestPhone: '+1 (555) 782-9901',
      checkInDate: checkIn.toISOString(),
      checkOutDate: checkOut.toISOString(),
      totalNights: 3,
      totalAmount: 540,
      paymentStatus: 'Paid',
      paymentMethod: 'Credit Card (Simulated)',
      bookingStatus: 'Confirmed',
      specialRequests: 'Late check-in requested after 8:00 PM.',
      createdAt: new Date().toISOString()
    }
  ];
};

const loadState = async () => {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      state = data;
    } else {
      await initUsers();
      saveState();
    }
  } catch (err) {
    await initUsers();
    saveState();
  }
};

const saveState = () => {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2));
  } catch (err) {
    console.error('Failed to save state to db.json:', err.message);
  }
};

loadState();

// Users Methods
const findUserByEmail = (email) => {
  return state.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
};

const findUserById = (id) => {
  const user = state.users.find((u) => u._id === id);
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
};

const createUser = async ({ name, email, password, phone, role }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    _id: 'user_' + Date.now(),
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    phone: phone || '',
    role: role || 'guest',
    createdAt: new Date().toISOString()
  };
  state.users.push(newUser);
  saveState();
  return newUser;
};

const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

// Rooms Methods
const getRooms = ({ type, minPrice, maxPrice, capacity, checkIn, checkOut, search } = {}) => {
  let filtered = [...state.rooms];

  if (type && type !== 'All') {
    filtered = filtered.filter((r) => r.type === type);
  }

  if (minPrice) {
    filtered = filtered.filter((r) => r.pricePerNight >= Number(minPrice));
  }

  if (maxPrice) {
    filtered = filtered.filter((r) => r.pricePerNight <= Number(maxPrice));
  }

  if (capacity) {
    filtered = filtered.filter((r) => r.capacity >= Number(capacity));
  }

  if (search) {
    const term = search.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.title.toLowerCase().includes(term) ||
        r.description.toLowerCase().includes(term) ||
        r.roomNumber.toLowerCase().includes(term)
    );
  }

  if (checkIn && checkOut) {
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);

    const overlappingBookings = state.bookings.filter((b) => {
      if (!['Confirmed', 'Checked-In'].includes(b.bookingStatus)) return false;
      const bIn = new Date(b.checkInDate);
      const bOut = new Date(b.checkOutDate);
      return bIn < outDate && bOut > inDate;
    });

    const bookedRoomIds = overlappingBookings.map((b) => (typeof b.room === 'object' ? b.room._id : b.room));
    filtered = filtered.filter((r) => !bookedRoomIds.includes(r._id));
  }

  return filtered;
};

const getRoomById = (id) => {
  return state.rooms.find((r) => r._id === id);
};

const createRoom = (data) => {
  const newRoom = {
    _id: 'room_' + Date.now(),
    ...data,
    createdAt: new Date().toISOString()
  };
  state.rooms.push(newRoom);
  saveState();
  return newRoom;
};

const updateRoom = (id, data) => {
  const index = state.rooms.findIndex((r) => r._id === id);
  if (index === -1) return null;
  state.rooms[index] = { ...state.rooms[index], ...data };
  saveState();
  return state.rooms[index];
};

const deleteRoom = (id) => {
  const index = state.rooms.findIndex((r) => r._id === id);
  if (index === -1) return false;
  state.rooms.splice(index, 1);
  saveState();
  return true;
};

// Bookings Methods
const createBooking = (data) => {
  const newBooking = {
    _id: 'bk_' + Date.now(),
    ...data,
    paymentStatus: data.paymentStatus || 'Paid',
    bookingStatus: data.bookingStatus || 'Confirmed',
    createdAt: new Date().toISOString()
  };
  state.bookings.push(newBooking);
  saveState();
  return populateBooking(newBooking);
};

const populateBooking = (booking) => {
  if (!booking) return null;
  const roomObj = typeof booking.room === 'object' ? booking.room : state.rooms.find((r) => r._id === booking.room);
  const userObj = typeof booking.user === 'object' ? booking.user : state.users.find((u) => u._id === booking.user);
  return {
    ...booking,
    room: roomObj || null,
    user: userObj ? { _id: userObj._id, name: userObj.name, email: userObj.email } : null
  };
};

const getBookingsByUser = (userId) => {
  return state.bookings
    .filter((b) => (typeof b.user === 'object' ? b.user._id === userId : b.user === userId))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(populateBooking);
};

const getAllBookings = () => {
  return state.bookings
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(populateBooking);
};

const getBookingById = (id) => {
  const booking = state.bookings.find((b) => b._id === id);
  return populateBooking(booking);
};

const updateBookingStatus = (id, { bookingStatus, paymentStatus }) => {
  const index = state.bookings.findIndex((b) => b._id === id);
  if (index === -1) return null;
  if (bookingStatus) state.bookings[index].bookingStatus = bookingStatus;
  if (paymentStatus) state.bookings[index].paymentStatus = paymentStatus;
  saveState();
  return populateBooking(state.bookings[index]);
};

// Dashboard Stats
const getDashboardStats = () => {
  const totalRooms = state.rooms.length;
  const totalGuests = state.users.filter((u) => u.role === 'guest').length;
  const totalBookings = state.bookings.length;
  const confirmedBookings = state.bookings.filter((b) => ['Confirmed', 'Checked-In'].includes(b.bookingStatus)).length;
  const totalRevenue = state.bookings
    .filter((b) => b.bookingStatus !== 'Cancelled')
    .reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);
  const occupancyRate = totalRooms > 0 ? Math.min(100, Math.round((confirmedBookings / totalRooms) * 100)) : 0;
  const recentBookings = getAllBookings().slice(0, 6);

  return {
    totalRooms,
    totalGuests,
    totalBookings,
    confirmedBookings,
    occupancyRate,
    totalRevenue,
    recentBookings
  };
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  comparePassword,
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  createBooking,
  getBookingsByUser,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  getDashboardStats
};
