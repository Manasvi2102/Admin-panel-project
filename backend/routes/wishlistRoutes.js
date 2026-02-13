import express from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { protect } from '../middleware/auth.js';
import { Wishlist } from '../models/Wishlist.js';
import { Book } from '../models/Book.js';

const router = express.Router();

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('books');

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, books: [] });
    }

    res.json({
      success: true,
      data: wishlist,
    });
  })
);

// @desc    Add book to wishlist
// @route   POST /api/wishlist
// @access  Private
router.post(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const { bookId } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, books: [] });
    }

    // Check if book already in wishlist
    if (wishlist.books.includes(bookId)) {
      return res.status(400).json({
        success: false,
        message: 'Book already in wishlist',
      });
    }

    wishlist.books.push(bookId);
    await wishlist.save();
    await wishlist.populate('books');

    res.json({
      success: true,
      data: wishlist,
    });
  })
);

// @desc    Remove book from wishlist
// @route   DELETE /api/wishlist/:bookId
// @access  Private
router.delete(
  '/:bookId',
  protect,
  asyncHandler(async (req, res) => {
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found',
      });
    }

    wishlist.books = wishlist.books.filter(
      (book) => book.toString() !== req.params.bookId
    );

    await wishlist.save();
    await wishlist.populate('books');

    res.json({
      success: true,
      data: wishlist,
    });
  })
);

export default router;

