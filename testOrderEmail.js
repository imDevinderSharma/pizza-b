const emailService = require('./utils/emailService');

// Test order confirmation email
const testOrderEmail = async () => {
  try {
    console.log('Starting order email test...');
    
    // Create a mock order object that matches the structure expected by the email service
    const mockOrder = {
      _id: 'TEST-' + Date.now(),
      createdAt: new Date(),
      items: [
        {
          pizza: { 
            name: 'Margherita Pizza',
            price: 9.99 
          },
          quantity: 2,
          price: 9.99
        },
        {
          pizza: { 
            name: 'Pepperoni Pizza',
            price: 11.99 
          },
          quantity: 1,
          price: 11.99
        }
      ],
      totalAmount: 31.97,
      deliveryAddress: {
        street: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
        phone: '555-1234',
        email: 'iamdevindersharma15122005@gmail.com' // Use your email here
      },
      paymentMethod: 'COD',
      paymentStatus: 'Pending',
      specialInstructions: 'This is a test order'
    };
    
    console.log('Testing admin notification email...');
    const adminResult = await emailService.sendOrderNotification(mockOrder);
    console.log('Admin notification result:', adminResult.messageId);
    
    console.log('Testing customer confirmation email...');
    const customerResult = await emailService.sendOrderConfirmation(mockOrder);
    console.log('Customer confirmation result:', customerResult.messageId);
    
    console.log('Email test completed successfully!');
  } catch (error) {
    console.error('Error in order email test:', error);
  }
};

// Run the test
testOrderEmail(); 