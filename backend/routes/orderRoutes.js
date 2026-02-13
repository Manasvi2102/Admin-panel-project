import express from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { protect, authorize } from '../middleware/auth.js';
import { Order } from '../models/Order.js';
import { Cart } from '../models/Cart.js';
import { Book } from '../models/Book.js';

const router = express.Router();

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const { shippingAddress, paymentMethod } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.book');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty',
      });
    }

    // Validate stock and prepare order items
    const orderItems = [];
    for (const item of cart.items) {
      const book = await Book.findById(item.book._id);
      
      if (!book || book.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${book.title}`,
        });
      }

      orderItems.push({
        book: item.book._id,
        quantity: item.quantity,
        price: book.price,
        discount: book.discount,
      });
    }

    // Calculate totals
    const subtotal = orderItems.reduce((total, item) => {
      const itemPrice = item.price * (1 - (item.discount || 0) / 100);
      return total + itemPrice * item.quantity;
    }, 0);

    const shippingCost = subtotal > 50 ? 0 : 5; // Free shipping over $50
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shippingCost + tax;

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'cash',
      subtotal,
      shippingCost,
      tax,
      total,
    });

    // Update stock
    for (const item of orderItems) {
      await Book.findByIdAndUpdate(item.book, {
        $inc: { stock: -item.quantity },
      });
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      data: order,
    });
  })
);

// @desc    Get user's orders
// @route   GET /api/orders/myorders
// @access  Private
router.get(
  '/myorders',
  protect,
  asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.book')
      .sort('-createdAt');

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  })
);

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
router.get(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('items.book');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Make sure user owns order or is admin
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order',
      });
    }

    res.json({
      success: true,
      data: order,
    });
  })
);

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
router.get(
  '/',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.book')
      .sort('-createdAt');

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  })
);

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put(
  '/:id/status',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    
    if (orderStatus === 'delivered') {
      order.deliveredAt = Date.now();
    }

    await order.save();

    res.json({
      success: true,
      data: order,
    });
  })
);

export default router;

