const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Pizza = require('../models/Pizza');

// Load environment variables
dotenv.config();

// Sample pizza data
const pizzaData = [
  {
    name: 'Margherita',
    description: 'Classic pizza with tomato sauce, mozzarella cheese, and fresh basil.',
    price: 1039.20,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
    category: 'pizza',
    isVegetarian: true,
    isAvailable: true,
    toppings: ['Tomato Sauce', 'Mozzarella', 'Fresh Basil'],
  },
  {
    name: 'Pepperoni',
    description: 'American classic topped with spicy pepperoni slices and mozzarella cheese.',
    price: 1199.20,
    image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
    category: 'pizza',
    isVegetarian: false,
    isAvailable: true,
    toppings: ['Tomato Sauce', 'Mozzarella', 'Pepperoni'],
  },
  {
    name: 'Veggie Delight',
    description: 'Fresh vegetables including bell peppers, mushrooms, onions, and olives.',
    price: 1119.20,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
    category: 'pizza',
    isVegetarian: true,
    isAvailable: true,
    toppings: ['Tomato Sauce', 'Mozzarella', 'Bell Peppers', 'Mushrooms', 'Onions', 'Olives'],
  },
  {
    name: 'Meat Lovers',
    description: 'For meat lovers with pepperoni, sausage, bacon, and ground beef.',
    price: 1359.20,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
    category: 'pizza',
    isVegetarian: false,
    isAvailable: true,
    toppings: ['Tomato Sauce', 'Mozzarella', 'Pepperoni', 'Sausage', 'Bacon', 'Ground Beef'],
  },
  {
    name: 'Hawaiian',
    description: 'Sweet and savory combination of ham and pineapple.',
    price: 1279.20,
    image: 'https://images.unsplash.com/photo-1595708684082-a173bb3a06c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
    category: 'pizza',
    isVegetarian: false,
    isAvailable: true,
    toppings: ['Tomato Sauce', 'Mozzarella', 'Ham', 'Pineapple'],
  },
  {
    name: 'Garlic Bread',
    description: 'Freshly baked bread with garlic butter and herbs.',
    price: 479.20,
    image: 'https://images.unsplash.com/photo-1619531038896-deaff53d151a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
    category: 'sides',
    isVegetarian: true,
    isAvailable: true,
    toppings: [],
  },
  {
    name: 'Cola',
    description: 'Refreshing cola drink to complement your meal.',
    price: 199.20,
    image: 'https://images.unsplash.com/photo-1629203432180-61c6b3d99ff1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
    category: 'drinks',
    isVegetarian: true,
    isAvailable: true,
    toppings: [],
  },
];

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pizzahost')
  .then(() => console.log('MongoDB Connected for seeding'))
  .catch(err => console.log('MongoDB Connection Error during seeding:', err));

// Seed function
const seedDatabase = async () => {
  try {
    // Clear existing data
    await Pizza.deleteMany({});
    console.log('Cleared existing menu items');

    // Insert sample data
    const insertedItems = await Pizza.insertMany(pizzaData);
    console.log(`Inserted ${insertedItems.length} menu items successfully!`);

    // Close the connection
    mongoose.disconnect();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase(); 