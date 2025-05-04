const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
// const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middlewares
app.use(cors());
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
    console.log(`API base URL: http://localhost:${PORT}/api`);
  });
}

// Export the Express app for Vercel
module.exports = app; 