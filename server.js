const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
// const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Base URL for API (production vs development)
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://pizzahost-backend.vercel.app/api'
  : `http://localhost:${process.env.PORT || 3000}/api`;

// CORS configuration
const corsOptions = {
  origin: ['https://pizza-f.vercel.app', 'http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Import routes
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Use routes
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('PizzaHost API is running...');
});

// Comment out MongoDB connection for now
/*
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/pizzahost')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error:', err));
*/

console.log('Running without MongoDB connection for now');

// Use environment port or default to 3000
const PORT = process.env.PORT || 3000;

// Start server
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API base URL: ${API_BASE_URL}`);
  });
}

// Export the Express app for Vercel
module.exports = app; 