// Temporary in-memory data store
const menuItems = [
  {
    _id: '1',
    name: 'Cheese Pizza',
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
  },
  {
    _id: '2',
    name: 'Pepperoni Pizza',
    description: 'Pepperoni and cheese pizza with our signature sauce',
    price: 280,
    sizeOptions: {
      small: { price: 140, available: true },
      medium: { price: 280, available: true },
      large: { price: 420, available: true }
    },
    image: 'https://www.simplyrecipes.com/thmb/8caxM88NgxuQQWDoCSMhSnodFyo=/2000x1334/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2019__09__easy-pepperoni-pizza-lead-3-8f256746d649404baa36a44d271329bc.jpg',
    category: 'pizza',
    subcategory: 'non_veg',
    isVegetarian: false,
    isAvailable: true,
    toppings: ['Cheese', 'Pepperoni'],
    allowCheeseBurst: true,
    allowExtraToppings: true
  }
];

// Get all menu items
exports.getAllMenuItems = async (req, res) => {
  try {
    res.status(200).json({ success: true, count: menuItems.length, data: menuItems });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Get menu item by ID
exports.getMenuItemById = async (req, res) => {
  try {
    const menuItem = menuItems.find(item => item._id === req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({ success: false, error: 'Menu item not found' });
    }
    
    res.status(200).json({ success: true, data: menuItem });
  } catch (error) {
    console.error('Error fetching menu item:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Create new menu item
exports.createMenuItem = async (req, res) => {
  try {
    const newItem = {
      _id: String(menuItems.length + 1), // Simple ID generation
      ...req.body
    };
    menuItems.push(newItem);
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// Update menu item
exports.updateMenuItem = async (req, res) => {
  try {
    const index = menuItems.findIndex(item => item._id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Menu item not found' });
    }
    
    const updatedItem = {
      ...menuItems[index],
      ...req.body
    };
    
    menuItems[index] = updatedItem;
    res.status(200).json({ success: true, data: updatedItem });
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete menu item
exports.deleteMenuItem = async (req, res) => {
  try {
    const index = menuItems.findIndex(item => item._id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Menu item not found' });
    }
    
    menuItems.splice(index, 1);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
}; 