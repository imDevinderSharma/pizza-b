const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    items: [
      {
        pizza: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Pizza',
          required: true,
        },
        size: {
          type: String,
          enum: ['small', 'medium', 'large'],
          default: 'medium',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    deliveryAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['COD', 'UPI'],
    },
    paymentStatus: {
      type: String,
      default: 'Pending',
      enum: ['Pending', 'Completed', 'Failed'],
    },
    orderStatus: {
      type: String,
      default: 'Placed',
      enum: ['Placed', 'Processing', 'In Transit', 'Delivered', 'Cancelled'],
    },
    specialInstructions: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema); 