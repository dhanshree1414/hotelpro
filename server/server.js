const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/error');

// Load environment variables
dotenv.config();

// Connect to Database (or activate auto fallback store)
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/rooms', require('./routes/roomRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'HotelPro API is running smoothly',
    mode: global.isMongoConnected ? 'MongoDB' : 'Built-in Persistent Store',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend automatically whenever dist exists
const distPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('HotelPro API is running. Start the React client with npm run dev.');
  });
}

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`HotelPro server running on port ${PORT}`);
  console.log(`Access Web App: http://localhost:${PORT}`);
});
