const mongoose = require('mongoose');

global.isMongoConnected = false;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hotelpro';
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500,
      connectTimeoutMS: 2500
    });
    global.isMongoConnected = true;
    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    global.isMongoConnected = false;
    console.log(`ℹ MongoDB not detected (${error.message}).`);
    console.log(`✓ Seamlessly activated HotelPro Built-in Persistent Data Engine (Zero configuration required!)`);
  }
};

module.exports = connectDB;
