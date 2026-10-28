const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Room = require('./models/Room');
const Booking = require('./models/Booking');
const connectDB = require('./config/db');

dotenv.config();

const rooms = [
  {
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
    rating: 4.9
  },
  {
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
    rating: 4.95
  },
  {
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
    rating: 4.7
  },
  {
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
    rating: 5.0
  },
  {
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
    rating: 4.85
  },
  {
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
    rating: 4.65
  }
];

const seedData = async () => {
  try {
    await connectDB();

    await Room.deleteMany();
    await User.deleteMany();
    await Booking.deleteMany();

    // Create Admin and Guest accounts
    const adminUser = await User.create({
      name: 'HotelPro Admin',
      email: 'admin@hotelpro.com',
      password: 'adminpassword123',
      phone: '+1 (555) 019-2834',
      role: 'admin'
    });

    const guestUser = await User.create({
      name: 'John Guest',
      email: 'guest@hotelpro.com',
      password: 'guestpassword123',
      phone: '+1 (555) 782-9901',
      role: 'guest'
    });

    // Insert rooms
    const createdRooms = await Room.insertMany(rooms);

    // Create a sample booking for demonstration
    const checkIn = new Date();
    checkIn.setDate(checkIn.getDate() + 2);
    const checkOut = new Date();
    checkOut.setDate(checkOut.getDate() + 5);

    await Booking.create({
      user: guestUser._id,
      room: createdRooms[0]._id,
      guestName: guestUser.name,
      guestEmail: guestUser.email,
      guestPhone: guestUser.phone,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      totalNights: 3,
      totalAmount: createdRooms[0].pricePerNight * 3,
      paymentStatus: 'Paid',
      paymentMethod: 'Credit Card (Simulated)',
      bookingStatus: 'Confirmed',
      specialRequests: 'Late check-in requested after 8:00 PM.'
    });

    console.log('HotelPro database seeded successfully!');
    console.log('Sample Admin Account: admin@hotelpro.com / adminpassword123');
    console.log('Sample Guest Account: guest@hotelpro.com / guestpassword123');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error.message}`);
    process.exit(1);
  }
};

seedData();
