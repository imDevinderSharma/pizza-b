// In-memory data store
// Create our own menu items array instead of importing from frontend
const menuItems = [
  // Simply Veg Pizzas
  {
    _id: 'sv1',
    name: 'Simply Veg Cheese Pizza',
    description: 'Single Cheese Topping',
    price: 230,
    sizeOptions: {
      small: { price: 115, available: true },
      medium: { price: 230, available: true },
      large: { price: 350, available: true }
    },
    image: 'https://www.foodandwine.com/thmb/Wd4lBRZz3X_8qBr69UOu2m7I2iw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/classic-cheese-pizza-FT-RECIPE0422-31a2c938fc2546c9a07b7011658cfd05.jpg',
    category: 'pizza',
    subcategory: 'simply_veg',
    isVegetarian: true,
    isAvailable: true,
    toppings: ['Cheese'],
    allowCheeseBurst: true,
    allowExtraToppings: true
  },
  {
    _id: 'sv2',
    name: 'Cheese & Corn',
    description: 'Corn Topping Pizza',
    price: 230,
    sizeOptions: {
      small: { price: 115, available: true },
      medium: { price: 230, available: true },
      large: { price: 350, available: true }
    },
    image: 'https://bakesquare.in/wp-content/uploads/2023/04/5qgpBjIyHm4XLzDk1OHleamgDNKt6nbSm-nv73i4k7eDDyq5mh5DV0awva1cF6ptuA5lVCB96VnjN93xLE06qfEebGwnPHwKwpNh.jpg',
    category: 'pizza',
    subcategory: 'simply_veg',
    isVegetarian: true,
    isAvailable: true,
    toppings: ['Cheese', 'Corn'],
    allowCheeseBurst: true,
    allowExtraToppings: true
  },
  {
    _id: 'sv3',
    name: 'Cheese & Onion',
    description: 'Onion Topping Pizza',
    price: 230,
    sizeOptions: {
      small: { price: 115, available: true },
      medium: { price: 230, available: true },
      large: { price: 350, available: true }
    },
    image: 'https://img-global.cpcdn.com/recipes/cd6fec5ae0b70986/1200x630cq70/photo.jpg',
    category: 'pizza',
    subcategory: 'simply_veg',
    isVegetarian: true,
    isAvailable: true,
    toppings: ['Cheese', 'Onion'],
    allowCheeseBurst: true,
    allowExtraToppings: true
  },
  // Veg Delight
  {
    _id: 'vd1',
    name: 'Double Cheese Pizza',
    description: 'Loaded With Extra Cheese',
    price: 270,
    sizeOptions: {
      small: { price: 150, available: true },
      medium: { price: 270, available: true },
      large: { price: 400, available: true }
    },
    image: 'https://cdn.dotpe.in/longtail/store-items/8719830/D1D8WAHx.webp',
    category: 'pizza',
    subcategory: 'veg_delight',
    isVegetarian: true,
    isAvailable: true,
    toppings: ['Extra Cheese'],
    allowCheeseBurst: true,
    allowExtraToppings: true
  },
  {
    _id: 'vd2',
    name: 'Garden Fresh',
    description: 'Onion, Capsicum Loaded With Extra Cheese',
    price: 270,
    sizeOptions: {
      small: { price: 150, available: true },
      medium: { price: 270, available: true },
      large: { price: 400, available: true }
    },
    image: 'https://cdn.dotpe.in/longtail/store-items/6385438/CpQiwPiv.jpeg',
    category: 'pizza',
    subcategory: 'veg_delight',
    isVegetarian: true,
    isAvailable: true,
    toppings: ['Onion', 'Capsicum', 'Extra Cheese'],
    allowCheeseBurst: true,
    allowExtraToppings: true
  },
  // Also support MongoDB IDs
  {
    _id: '680924b423f79839a4bc8db2', // Support for MongoDB objectIDs
    name: 'Cheese Pizza (MongoDB ID)',
    description: 'Classic cheese pizza with our signature sauce',
    price: 230,
    sizeOptions: {
      small: { price: 115, available: true },
      medium: { price: 230, available: true }, 
      large: { price: 350, available: true }
    },
    image: 'https://www.foodandwine.com/thmb/Wd4lBRZz3X_8qBr69UOu2m7I2iw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/classic-cheese-pizza-FT-RECIPE0422-31a2c938fc2546c9a07b7011658cfd05.jpg',
    category: 'pizza',
    subcategory: 'simply_veg',
    isVegetarian: true,
    isAvailable: true,
    toppings: ['Cheese'],
    allowCheeseBurst: true,
    allowExtraToppings: true
  }
];

// Import email service
const { sendOrderConfirmation, sendOrderNotification, sendTestEmail } = require('../utils/emailService');

// In-memory orders array
const orders = [];

// Create new order
exports.createOrder = async (req, res) => {
  try {
    console.log('Order creation started - Request body:', JSON.stringify(req.body, null, 2));
    const { items, deliveryAddress, paymentMethod, specialInstructions, paymentStatus, totalAmount } = req.body;

    // Validation checks
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error('Invalid or empty items array');
      return res.status(400).json({
        success: false,
        error: 'Invalid or empty items array',
      });
    }

    if (!deliveryAddress || !deliveryAddress.email) {
      console.error('Missing delivery address or email');
      return res.status(400).json({
        success: false,
        error: 'Delivery address and email are required',
      });
    }

    console.log('Order params extracted:', { 
      itemsCount: items?.length, 
      deliveryAddress: !!deliveryAddress,
      paymentMethod,
      hasSpecialInstructions: !!specialInstructions,
      paymentStatus 
    });

    // Process each item
    const processedItems = [];
    let hasInvalidItems = false;

    for (const item of items) {
      if (!item.pizza) {
        console.error('Item missing pizza ID:', item);
        hasInvalidItems = true;
        continue;
      }

      // Ensure we preserve all available item details
      processedItems.push({
        pizza: item.pizza,
        pizzaName: item.pizzaName, // Preserve the name for email display
        size: item.size || 'medium',
        quantity: item.quantity || 1,
        price: item.price || 0
      });
    }

    if (processedItems.length === 0) {
      console.error('No valid pizza items found in order');
      return res.status(400).json({
        success: false,
        error: 'No valid pizza items found in order',
      });
    }

    // Extract the valid pizza IDs for lookup
    const pizzaIds = processedItems.map(item => item.pizza);
    console.log('Looking up pizzas with IDs:', pizzaIds);

    // Find all pizzas with the valid IDs from menuItems
    const pizzas = menuItems.filter(pizza => 
      pizzaIds.includes(pizza._id)
    );
    
    console.log('Found pizzas:', pizzas.length);

    // If no pizzas found but order has valid items, create generic pizza entries
    if (pizzas.length === 0) {
      console.log('No matching pizzas found, creating order with provided item details');
      
      // Create order with the processed items that already contain all needed info
      const orderItems = processedItems;
      
      // Create order - use a simple ID generation
      const orderId = String(Date.now());
      const order = {
        _id: orderId,
        items: orderItems,
        totalAmount: totalAmount || orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        deliveryAddress,
        paymentMethod,
        specialInstructions,
        paymentStatus: paymentMethod === 'COD' ? 'Pending' : (paymentStatus || 'Completed'),
        orderStatus: 'Placed',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Add to in-memory orders array
      orders.push(order);
      console.log('Order created with generic item data, ID:', orderId);

      // Send customer confirmation email
      console.log('Sending order confirmation email to:', deliveryAddress.email);
      let customerEmailResult;
      try {
        customerEmailResult = await sendOrderConfirmation(order, deliveryAddress.email);
        console.log('Customer email sending result:', customerEmailResult);
        
        // Include email preview URL in response if available
        if (customerEmailResult.previewUrl) {
          order.emailPreviewUrl = customerEmailResult.previewUrl;
        }
        
        if (!customerEmailResult.success) {
          console.warn('Customer email sending failed but continuing with order processing');
        }
      } catch (emailError) {
        console.error('Error sending customer email:', emailError);
        // Continue processing the order even if email fails
      }

      // Send admin notification email
      console.log('Sending order notification to admin');
      try {
        const adminEmailResult = await sendOrderNotification(order);
        console.log('Admin email sending result:', adminEmailResult);
        
        // Include admin email preview URL in response if available
        if (adminEmailResult.previewUrl) {
          order.adminEmailPreviewUrl = adminEmailResult.previewUrl;
        }
      } catch (adminEmailError) {
        console.error('Error sending admin notification:', adminEmailError);
        // Continue processing even if admin email fails
      }

      console.log('Order process completed successfully');
      return res.status(201).json({
        success: true,
        data: order,
        message: 'Your order is being processed. Check your email for confirmation.',
      });
    }

    // Create a map of pizza IDs to pizza objects for faster lookup
    const pizzaMap = {};
    pizzas.forEach(pizza => {
      pizzaMap[pizza._id] = pizza;
    });

    // Calculate total amount and build order items
    let calculatedTotal = 0;
    const orderItems = [];

    for (const item of processedItems) {
      const pizzaId = item.pizza;
      const pizza = pizzaMap[pizzaId];
      
      if (!pizza) {
        // If pizza not found in our map, use the item's data directly with all provided fields
        console.warn(`Pizza not found for ID: ${pizzaId}, using item data directly`);
        orderItems.push({
          pizza: pizzaId,
          pizzaName: item.pizzaName, // Preserve the name for email display
          size: item.size || 'medium',
          quantity: item.quantity || 1,
          price: item.price || 0
        });
        
        calculatedTotal += (item.price || 0) * (item.quantity || 1);
        continue;
      }
      
      // Get the price based on size
      let itemPrice = pizza.price; // Default to base price
      if (item.size) {
        if (item.size === 'small' && pizza.sizeOptions?.small?.price) {
          itemPrice = pizza.sizeOptions.small.price;
        } else if (item.size === 'large' && pizza.sizeOptions?.large?.price) {
          itemPrice = pizza.sizeOptions.large.price;
        }
      }
      
      const itemTotal = itemPrice * item.quantity;
      calculatedTotal += itemTotal;
      
      orderItems.push({
        pizza: pizzaId,
        pizzaName: pizza.name, // Store the name for easier reference
        size: item.size || 'medium',
        quantity: item.quantity,
        price: itemPrice,
      });
    }
    
    if (orderItems.length === 0) {
      console.error('No valid order items could be created');
      return res.status(400).json({
        success: false,
        error: 'Failed to create order items',
      });
    }
    
    // Use provided total amount or calculated one
    const finalTotalAmount = totalAmount || calculatedTotal;
    console.log('Order items processed. Total amount:', finalTotalAmount);

    // Determine payment status based on payment method
    const orderPaymentStatus = 
      paymentMethod === 'UPI' && paymentStatus ? 
        paymentStatus : 
        (paymentMethod === 'COD' ? 'Pending' : 'Pending');
    console.log('Payment status determined:', orderPaymentStatus);

    // Create order - use a simple ID generation
    const orderId = String(Date.now());
    const order = {
      _id: orderId,
      items: orderItems,
      totalAmount: finalTotalAmount,
      deliveryAddress,
      paymentMethod,
      specialInstructions,
      paymentStatus: orderPaymentStatus,
      orderStatus: 'Placed',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Add to in-memory orders array
    orders.push(order);
    console.log('Order created with ID:', orderId);

    // Send customer confirmation email
    console.log('Sending order confirmation email to:', deliveryAddress.email);
    let customerEmailResult;
    try {
      customerEmailResult = await sendOrderConfirmation(order, deliveryAddress.email);
      console.log('Customer email sending result:', customerEmailResult);
      
      // Include email preview URL in response if available (for test accounts)
      if (customerEmailResult.previewUrl) {
        order.emailPreviewUrl = customerEmailResult.previewUrl;
      }
      
      if (!customerEmailResult.success) {
        console.warn('Customer email sending failed but continuing with order processing');
      }
    } catch (emailError) {
      console.error('Error sending customer email:', emailError);
      // Continue processing the order even if email fails
    }

    // Send admin notification email
    console.log('Sending order notification to admin');
    try {
      const adminEmailResult = await sendOrderNotification(order);
      console.log('Admin email sending result:', adminEmailResult);
      
      // Include admin email preview URL in response if available
      if (adminEmailResult.previewUrl) {
        order.adminEmailPreviewUrl = adminEmailResult.previewUrl;
      }
    } catch (adminEmailError) {
      console.error('Error sending admin notification:', adminEmailError);
      // Continue processing even if admin email fails
    }

    console.log('Order process completed successfully');
    return res.status(201).json({
      success: true,
      data: order,
      message: 'Your order has been placed successfully! Check your email for confirmation.',
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(400).json({ 
      success: false, 
      error: `Failed to place your order: ${error.message}. Please try again.`
    });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    // Return orders with populated pizza details from menuItems
    const populatedOrders = orders.map(order => {
      const populatedItems = order.items.map(item => {
        const pizza = menuItems.find(p => p._id === item.pizza);
        return {
          ...item,
          pizza: pizza || { name: 'Unknown Pizza', price: item.price }
        };
      });
      
      return {
        ...order,
        items: populatedItems
      };
    });
    
    res.status(200).json({ 
      success: true, 
      count: populatedOrders.length, 
      data: populatedOrders 
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = orders.find(o => o._id === req.params.id);
    
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    // Populate pizza details from menuItems
    const populatedItems = order.items.map(item => {
      const pizza = menuItems.find(p => p._id === item.pizza);
      return {
        ...item,
        pizza: pizza || { name: 'Unknown Pizza', price: item.price }
      };
    });
    
    const populatedOrder = {
      ...order,
      items: populatedItems
    };
    
    res.status(200).json({ success: true, data: populatedOrder });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Update order
exports.updateOrder = async (req, res) => {
  try {
    const index = orders.findIndex(o => o._id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    const updatedOrder = {
      ...orders[index],
      ...req.body,
      updatedAt: new Date()
    };
    
    orders[index] = updatedOrder;
    
    res.status(200).json({ success: true, data: updatedOrder });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const index = orders.findIndex(o => o._id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    orders.splice(index, 1);
    
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    
    const index = orders.findIndex(o => o._id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    // Update the order with new status values
    orders[index] = {
      ...orders[index],
      orderStatus: orderStatus || orders[index].orderStatus,
      paymentStatus: paymentStatus || orders[index].paymentStatus,
      updatedAt: new Date()
    };
    
    // Populate pizza details for response
    const order = orders[index];
    const populatedItems = order.items.map(item => {
      const pizza = menuItems.find(p => p._id === item.pizza);
      return {
        ...item,
        pizza: pizza || { name: 'Unknown Pizza', price: item.price }
      };
    });
    
    const populatedOrder = {
      ...order,
      items: populatedItems
    };
    
    res.status(200).json({ success: true, data: populatedOrder });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// Test email functionality
exports.testEmail = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email address is required'
      });
    }
    
    console.log(`Sending test email to: ${email}`);
    
    // Use the real email service to send a test email
    const emailResult = await sendTestEmail(email);
    
    return res.status(200).json({
      success: emailResult.success,
      message: emailResult.message,
      previewUrl: emailResult.previewUrl // This will be available for test accounts
    });
  } catch (error) {
    console.error('Error in test email function:', error);
    return res.status(500).json({
      success: false,
      error: `Failed to send test email: ${error.message}`
    });
  }
};

// Test both emails
exports.testBothEmails = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email address is required'
      });
    }
    
    console.log(`Testing both emails to: ${email}`);
    
    // Create a sample order for testing
    const testOrder = {
      _id: `test-${Date.now()}`,
      items: [
        {
          pizza: 'sv1',
          pizzaName: 'Test Pizza',
          size: 'medium',
          quantity: 1,
          price: 250
        }
      ],
      totalAmount: 250,
      deliveryAddress: {
        street: 'Test Street',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
        phone: '1234567890',
        email: email
      },
      paymentMethod: 'COD',
      specialInstructions: 'This is a test order',
      paymentStatus: 'Pending',
      orderStatus: 'Testing',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Send customer email
    const customerResult = await sendOrderConfirmation(testOrder, email);
    console.log('Customer email result:', customerResult);
    
    // Send admin email
    const adminResult = await sendOrderNotification(testOrder);
    console.log('Admin email result:', adminResult);
    
    return res.status(200).json({
      success: true,
      customer: {
        success: customerResult.success,
        message: customerResult.message,
        previewUrl: customerResult.previewUrl
      },
      admin: {
        success: adminResult.success,
        message: adminResult.message,
        previewUrl: adminResult.previewUrl
      }
    });
  } catch (error) {
    console.error('Error testing both emails:', error);
    return res.status(500).json({
      success: false,
      error: `Failed to test emails: ${error.message}`
    });
  }
}; 