const express = require('express');
const router = express.Router();
const {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require('../controllers/menuController');

// Get all menu items & Create new menu item
router.route('/')
  .get(getAllMenuItems)
  .post(createMenuItem);

// Get, update, delete menu item by ID
router.route('/:id')
  .get(getMenuItemById)
  .put(updateMenuItem)
  .delete(deleteMenuItem);

module.exports = router; 