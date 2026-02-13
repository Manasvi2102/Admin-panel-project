import express from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { protect } from '../middleware/auth.js';
import { Cart } from '../models/Cart.js';
import { Book } from '../models/Book.js';

const router = express.Router();

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.book');

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.json({
      success: true,
      data: cart,
    });
  })
);

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
router.post(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const { bookId, quantity = 1 } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    if (book.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock',
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Check if item already exists in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.book.toString() === bookId
    );

    if (itemIndex > -1) {
      // Update quantity
      cart.items[itemIndex].quantity += quantity;
      if (cart.items[itemIndex].quantity > book.stock) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient stock',
        });
      }
    } else {
      // Add new item
      cart.items.push({ book: bookId, quantity });
    }

    await cart.save();
    await cart.populate('items.book');

    res.json({
      success: true,
      data: cart,
    });
  })
);

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
router.put(
  '/:itemId',
  protect,
  asyncHandler(async (req, res) => {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart',
      });
    }

    const book = await Book.findById(item.book);
    if (quantity > book.stock) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock',
      });
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate('items.book');

    res.json({
      success: true,
      data: cart,
    });
  })
);

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
router.delete(
  '/:itemId',
  protect,
  asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items = cart.items.filter(
      (item) => item._id.toString() !== req.params.itemId
    );

    await cart.save();
    await cart.populate('items.book');

    res.json({
      success: true,
      data: cart,
    });
  })
);

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
router.delete(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items = [];
    await cart.save();

    res.json({
      success: true,
      message: 'Cart cleared successfully',
    });
  })
);

export default router;

