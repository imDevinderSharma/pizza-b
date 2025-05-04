const mongoose = require('mongoose');

const PizzaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    sizeOptions: {
      small: {
        price: {
          type: Number,
          default: function() { return this.price * 0.8; }
        },
        available: {
          type: Boolean,
          default: true
        }
      },
      medium: {
        price: {
          type: Number,
          default: function() { return this.price; }
        },
        available: {
          type: Boolean,
          default: true
        }
      },
      large: {
        price: {
          type: Number,
          default: function() { return this.price * 1.2; }
        },
        available: {
          type: Boolean,
          default: true
        }
      }
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: 'pizza',
      enum: ['pizza', 'sides', 'drinks', 'desserts'],
    },
    isVegetarian: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    toppings: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pizza', PizzaSchema); 