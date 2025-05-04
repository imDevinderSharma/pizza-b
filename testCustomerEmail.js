const emailService = require('./utils/emailService');

// Email to test - change this to test with different email addresses
const TEST_EMAIL = process.argv[2] || 'test@example.com';

// Test order confirmation email
const testCustomerEmail = async () => {
  try {
    console.log(`Starting customer email test for ${TEST_EMAIL}...`);
    
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
        email: TEST_EMAIL
      },
      paymentMethod: 'COD',
      paymentStatus: 'Pending',
      specialInstructions: 'This is a test order'
    };
    
    console.log(`Testing customer confirmation email to ${TEST_EMAIL}...`);
    const customerResult = await emailService.sendOrderConfirmation(mockOrder);
    console.log('Customer confirmation email sent successfully!');
    console.log('Message ID:', customerResult.messageId);
    
    console.log('Email test completed successfully!');
  } catch (error) {
    console.error('Error in customer email test:', error);
  }
};

// Run the test
console.log('Starting customer email test...');
testCustomerEmail()
  .then(() => console.log('Test completed.'))
  .catch(err => console.error('Test failed:', err));

// Usage instructions
if (!process.argv[2]) {
  console.log('\nTIP: You can specify a test email address as a command line argument:');
  console.log('  node testCustomerEmail.js example@email.com');
}
    