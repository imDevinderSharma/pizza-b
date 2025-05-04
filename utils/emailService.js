const nodemailer = require('nodemailer');
// Remove import from menuData that's causing the error

// Admin email address
const ADMIN_EMAIL = 'iamdevindersharma15122005@gmail.com';

// Create Gmail transporter with OAuth2
const createGmailTransporter = () => {
  // Create the Gmail transporter with OAuth2 authentication
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'iamdevindersharma15122005@gmail.com',
      pass: 'ghhj bhlz mrsj jodx' // App password (not regular Gmail password)
    }
  });
  
  return transporter;
};

// Get a transporter - use Gmail
const getEmailTransporter = () => {
  try {
    return createGmailTransporter();
  } catch (error) {
    console.error('Error creating email transporter:', error);
    return null;
  }
};

// Send order confirmation to customer
const sendOrderConfirmation = async (order, customerEmail) => {
  try {
    console.log(`Preparing to send order confirmation to: ${customerEmail}`);
    
    // Get a transporter
    const emailTransporter = getEmailTransporter();
    
    if (!emailTransporter) {
      console.log('Falling back to mock email');
      return {
        success: true,
        message: `Mock email sent to ${customerEmail}`,
        isMock: true
      };
    }
    
    // Format order items for email
    const orderItemsHtml = order.items.map(item => {
      // Get the item name with proper fallbacks
      let itemName = '';
      
      // Check if item has a pizzaName property
      if (item.pizzaName) {
        itemName = item.pizzaName;
      } 
      // Check if item.pizza is an object with a name property
      else if (typeof item.pizza === 'object' && item.pizza && item.pizza.name) {
        itemName = item.pizza.name;
      }
      // Fallback to a generic name with the ID
      else {
        itemName = `Pizza (ID: ${typeof item.pizza === 'object' ? item.pizza._id : item.pizza})`;
      }
        
      return `
        <tr>
          <td>${itemName}</td>
          <td>${item.size || 'Medium'}</td>
          <td>${item.quantity}</td>
          <td>₹${item.price ? item.price.toFixed(2) : '0.00'}</td>
          <td>₹${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `;
    }).join('');
    
    // Create email HTML
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #d32f2f; text-align: center;">PizzaHost - Order Confirmation</h2>
        <p>Dear Customer,</p>
        <p>Thank you for your order! We're preparing it now and will deliver it soon.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Order #${order._id}</h3>
          <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
          <p><strong>Status:</strong> ${order.orderStatus}</p>
          <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
          <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
        </div>
        
        <h3>Order Items:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Item</th>
              <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Size</th>
              <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Qty</th>
              <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Price</th>
              <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${orderItemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="4" style="text-align: right; padding: 10px; border-top: 1px solid #ddd;"><strong>Grand Total:</strong></td>
              <td style="padding: 10px; border-top: 1px solid #ddd;"><strong>₹${order.totalAmount.toFixed(2)}</strong></td>
            </tr>
          </tfoot>
        </table>
        
        <div style="margin-top: 20px;">
          <h3>Delivery Address:</h3>
          <p>
            ${order.deliveryAddress.street}<br>
            ${order.deliveryAddress.city}, ${order.deliveryAddress.state} ${order.deliveryAddress.zipCode}<br>
            Phone: ${order.deliveryAddress.phone}
          </p>
        </div>
        
        ${order.specialInstructions ? `
          <div style="margin-top: 20px;">
            <h3>Special Instructions:</h3>
            <p>${order.specialInstructions}</p>
          </div>
        ` : ''}
        
        <div style="margin-top: 30px; text-align: center; color: #757575; font-size: 14px;">
          <p>If you have any questions about your order, please contact us at support@pizzahost.com</p>
          <p>© 2025 PizzaHost. All rights reserved.</p>
        </div>
      </div>
    `;
    
    // Email options
    const mailOptions = {
      from: '"PizzaHost" <iamdevindersharma15122005@gmail.com>',
      to: customerEmail,
      subject: `Order Confirmation #${order._id}`,
      html: emailHtml
    };
    
    console.log('Sending customer confirmation email...');
    
    // Send email
    try {
      const info = await emailTransporter.sendMail(mailOptions);
      console.log('Customer email sent successfully!', info.messageId);
      
      return {
        success: true,
        message: `Email sent to ${customerEmail}`
      };
    } catch (sendError) {
      console.error('Error in sendMail:', sendError);
      throw sendError;
    }
  } catch (error) {
    console.error('Error sending customer email:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Send order notification to admin
const sendOrderNotification = async (order) => {
  try {
    console.log('Attempting to send admin notification email...');
    
    // Get a transporter
    const emailTransporter = getEmailTransporter();
    
    if (!emailTransporter) {
      console.log('Falling back to mock email for admin notification');
      return {
        success: true,
        message: `Mock admin notification email sent`,
        isMock: true
      };
    }
    
    // Format items for email with enhanced details
    const itemList = order.items.map(item => {
      // Determine item details with better fallback strategy
      let pizzaName = '';
      let pizzaId = '';
      let pizzaDescription = '';
      
      // First try to get pizza details from pizzaName property
      if (item.pizzaName) {
        pizzaName = item.pizzaName;
        pizzaId = typeof item.pizza === 'object' ? item.pizza._id : item.pizza;
        pizzaDescription = 'Custom pizza order';
      } 
      // Then try to get from populated pizza object
      else if (typeof item.pizza === 'object' && item.pizza) {
        pizzaName = item.pizza.name || 'Unknown Pizza';
        pizzaId = item.pizza._id || 'Unknown ID';
        pizzaDescription = item.pizza.description || 'No description available';
      } 
      // Fallback to using the pizza ID directly
      else {
        pizzaName = `Pizza (ID: ${item.pizza})`;
        pizzaId = item.pizza;
        pizzaDescription = 'No description available';
      }
      
      return `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <strong>${pizzaName}</strong> (${item.size})
            <br>
            <small>Menu Item ID: ${pizzaId}</small>
            <br>
            <small>${pizzaDescription}</small>
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price ? item.price.toFixed(2) : '0.00'}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `;
    }).join('');

    const customerEmail = order.deliveryAddress?.email || 'Not provided';
    console.log('Admin email recipient:', ADMIN_EMAIL);
    console.log('Customer email in order:', customerEmail);

    const mailOptions = {
      from: '"PizzaHost Orders" <iamdevindersharma15122005@gmail.com>',
      to: ADMIN_EMAIL,
      subject: `New Order Placed #${order._id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d32f2f;">New Order Details</h2>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Order ID:</strong> ${order._id}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
            <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
            <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
            <p><strong>Customer Email:</strong> ${customerEmail}</p>
          </div>
          
          <h3 style="color: #d32f2f; border-bottom: 2px solid #d32f2f; padding-bottom: 5px;">Ordered Items:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f5f5f5;">
                <th style="padding: 10px; text-align: left;">Item Details</th>
                <th style="padding: 10px; text-align: center;">Qty</th>
                <th style="padding: 10px; text-align: right;">Price</th>
                <th style="padding: 10px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemList}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding: 10px; text-align: right;"><strong>Grand Total:</strong></td>
                <td style="padding: 10px; text-align: right;"><strong>₹${order.totalAmount}</strong></td>
              </tr>
            </tfoot>
          </table>
          
          <h3 style="color: #d32f2f; border-bottom: 2px solid #d32f2f; padding-bottom: 5px;">Delivery Address:</h3>
          <p>${order.deliveryAddress.street}</p>
          <p>${order.deliveryAddress.city}, ${order.deliveryAddress.state} ${order.deliveryAddress.zipCode}</p>
          <p><strong>Phone:</strong> ${order.deliveryAddress.phone}</p>
          
          ${order.specialInstructions ? `
            <h3 style="color: #d32f2f; border-bottom: 2px solid #d32f2f; padding-bottom: 5px;">Special Instructions:</h3>
            <p>${order.specialInstructions}</p>
          ` : ''}
        </div>
      `,
      priority: 'high'
    };

    console.log('Sending admin email...');
    try {
      const info = await emailTransporter.sendMail(mailOptions);
      console.log('Admin email sent successfully!', info.messageId);
      
      return {
        success: true,
        message: `Admin email sent to ${ADMIN_EMAIL}`
      };
    } catch (sendError) {
      console.error('Error in sendMail:', sendError);
      throw sendError;
    }
  } catch (error) {
    console.error('Admin email sending error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Send test email
const sendTestEmail = async (email) => {
  try {
    console.log(`Preparing to send test email to: ${email}`);
    
    // Get a transporter
    const emailTransporter = getEmailTransporter();
    
    if (!emailTransporter) {
      console.log('Falling back to mock email');
      return {
        success: true,
        message: `Mock test email sent to ${email}`,
        isMock: true
      };
    }
    
    // Email options
    const mailOptions = {
      from: '"PizzaHost" <iamdevindersharma15122005@gmail.com>',
      to: email,
      subject: 'PizzaHost - Test Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #d32f2f; text-align: center;">PizzaHost - Test Email</h2>
          <p>Dear Customer,</p>
          <p>This is a test email from PizzaHost. If you're receiving this, our email system is working correctly.</p>
          <p>Thank you for using our service!</p>
          <div style="margin-top: 30px; text-align: center; color: #757575; font-size: 14px;">
            <p>© 2025 PizzaHost. All rights reserved.</p>
          </div>
        </div>
      `
    };
    
    console.log('Sending test email...');
    
    // Send email
    try {
      const info = await emailTransporter.sendMail(mailOptions);
      console.log('Test email sent successfully!', info.messageId);
      
      return {
        success: true,
        message: `Test email sent to ${email}`
      };
    } catch (sendError) {
      console.error('Error in sendMail:', sendError);
      throw sendError;
    }
  } catch (error) {
    console.error('Error sending test email:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  sendOrderConfirmation,
  sendOrderNotification,
  sendTestEmail,
  ADMIN_EMAIL
}; 