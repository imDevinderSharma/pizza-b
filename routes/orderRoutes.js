const express = require('express');
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  updateOrderStatus,
  testEmail,
  testBothEmails
} = require('../controllers/orderController');
const { sendTestEmail } = require('../utils/emailService');

// Get all orders & Create new order
router.route('/')
  .get(getAllOrders)
  .post(createOrder);

// Get order by ID, Update order, Delete order
router.route('/:id')
  .get(getOrderById)
  .put(updateOrder)
  .delete(deleteOrder)
  .patch(updateOrderStatus);

// Test email functionality
router.post('/test-email', testEmail);

// Test admin notification email
router.post('/test-admin-email', async (req, res) => {
  try {
    const { email } = req.body || { email: 'admin@pizzahost.com' };
    
    // Use the real email service
    const emailResult = await sendTestEmail(email);
    
    res.status(200).json({
      success: emailResult.success,
      message: `Admin notification email ${emailResult.isMock ? 'would be' : 'was'} sent to ${email}`,
      previewUrl: emailResult.previewUrl,
      data: { 
        recipient: email
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
      details: error.message
    });
  }
});

// Test customer confirmation email
router.post('/test-customer-email', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email address is required'
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }
    
    console.log(`Testing customer confirmation email to: ${email}`);
    
    // Use the real email service
    const emailResult = await sendTestEmail(email);
    
    res.status(200).json({
      success: emailResult.success,
      message: `Customer confirmation email ${emailResult.isMock ? 'would be' : 'was'} sent to ${email}`,
      previewUrl: emailResult.previewUrl,
      data: { 
        recipient: email
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
      details: error.message
    });
  }
});

// Alternative email test with direct nodemailer usage
router.post('/alt-email-test', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email address is required'
      });
    }

    // Use the real email service
    const emailResult = await sendTestEmail(email);
    
    res.status(200).json({
      success: emailResult.success,
      message: `Direct test email ${emailResult.isMock ? 'would be' : 'was'} sent to ${email}`,
      previewUrl: emailResult.previewUrl,
      data: { 
        recipient: email
      }
    });
  } catch (error) {
    console.error('Error in direct email test:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send direct test email',
      details: error.message
    });
  }
});

// Test both emails
router.route('/test-both-emails')
  .post(testBothEmails);

module.exports = router; 