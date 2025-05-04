const emailService = require('./utils/emailService');

// Sample order for testing
const testOrder = {
  _id: 'TEST-' + Date.now(),
  createdAt: new Date(),
  items: [
    {
      pizza: { name: 'Test Pizza' },
      quantity: 1,
      price: 9.99
    }
  ],
  totalAmount: 9.99,
  deliveryAddress: {
    street: '123 Test Street',
    city: 'Test City',
    state: 'Test State',
    zipCode: '12345',
    phone: '555-1234',
    email: 'test@example.com'
  },
  paymentMethod: 'COD',
  paymentStatus: 'Pending',
  specialInstructions: 'This is a test order'
};

// Test sending notification to admin
console.log('Sending test email to admin...');
emailService.sendOrderNotification(testOrder)
  .then(info => {
    console.log('Admin notification email sent successfully');
    console.log('Message ID:', info.messageId);
    process.exit(0);
  })
  .catch(error => {
    console.error('Failed to send admin notification email:', error);
    process.exit(1);
  }); 