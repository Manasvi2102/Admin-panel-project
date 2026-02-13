import express from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { protect, authorize } from '../middleware/auth.js';
import { Book } from '../models/Book.js';
import { Category } from '../models/Category.js';
import { Author } from '../models/Author.js';

const router = express.Router();

// @desc    Get all books with filters
// @route   GET /api/books
// @access  Public
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const {
      search,
      category,
      author,
      minPrice,
      maxPrice,
      minRating,
      featured,
      bestSeller,
      page = 1,
      limit = 12,
      sort = '-createdAt',
    } = req.query;

    // Build query
    const query = { isActive: true };

    // Search by title, description, or ISBN
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by category
    if (category) {
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      }
    }

    // Filter by author
    if (author) {
      const authorDoc = await Author.findOne({ name: { $regex: author, $options: 'i' } });
      if (authorDoc) {
        query.author = authorDoc._id;
      }
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Filter by rating
    if (minRating) {
      query['ratings.average'] = { $gte: Number(minRating) };
    }

    // Filter by featured
    if (featured === 'true') {
      query.featured = true;
    }

    // Filter by best seller
    if (bestSeller === 'true') {
      query.bestSeller = true;
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const books = await Book.find(query)
      .populate('author', 'name')
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Book.countDocuments(query);

    res.json({
      success: true,
      count: books.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: books,
    });
  })
);

// @desc    Get public stats
// @route   GET /api/books/stats
// @access  Public
router.get(
  '/stats',
  asyncHandler(async (req, res) => {
    // Total active books
    const books = await Book.countDocuments({ isActive: true });

    // Total users
    const User = (await import('../models/User.js')).default;
    const users = await User.countDocuments({ role: 'user', isActive: true });

    // Total orders
    const Order = (await import('../models/Order.js')).default;
    const orders = await Order.countDocuments();

    res.json({
      success: true,
      data: {
        books,
        users,
        orders,
      },
    });
  })
);

// @desc    Get trending books
// @route   GET /api/books/trending
// @access  Public
router.get(
  '/trending',
  asyncHandler(async (req, res) => {
    const { limit = 8 } = req.query;

    // Books with most views/interactions in the last 30 days
    // For now, we'll use books with highest ratings and most reviews
    const books = await Book.find({ isActive: true })
      .populate('author', 'name')
      .populate('category', 'name')
      .sort({ 'ratings.count': -1, 'ratings.average': -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: books,
    });
  })
);

// @desc    Get book of the day
// @route   GET /api/books/book-of-the-day
// @access  Public
router.get(
  '/book-of-the-day',
  asyncHandler(async (req, res) => {
    // For now, select a random featured book
    // In production, this could be manually set or based on algorithm
    const books = await Book.find({ isActive: true, featured: true })
      .populate('author', 'name')
      .populate('category', 'name')
      .sort({ 'ratings.average': -1 });

    if (books.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No featured books available',
      });
    }

    // Select book based on day of month for consistency
    const dayOfMonth = new Date().getDate();
    const selectedBook = books[dayOfMonth % books.length];

    res.json({
      success: true,
      data: selectedBook,
    });
  })
);

// @desc    Get single book by ID
// @route   GET /api/books/:id
// @access  Public
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id)
      .populate('author', 'name bio nationality')
      .populate('category', 'name slug')
      .populate('reviews.user', 'name');

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    res.json({
      success: true,
      data: book,
    });
  })
);

// @desc    Create new book
// @route   POST /api/books
// @access  Private/Admin
router.post(
  '/',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const book = await Book.create(req.body);

    res.status(201).json({
      success: true,
      data: book,
    });
  })
);

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Private/Admin
router.put(
  '/:id',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    let book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('author', 'name bio nationality')
      .populate('category', 'name slug')
      .populate('reviews.user', 'name');

    // Recalculate ratings if reviews changed
    if (req.body.reviews) {
      book.calculateRatings();
      await book.save();
    }

    res.json({
      success: true,
      data: book,
    });
  })
);

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Private/Admin
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    // Soft delete
    book.isActive = false;
    await book.save();

    res.json({
      success: true,
      message: 'Book deleted successfully',
    });
  })
);


// @desc    Add review to book
// @route   POST /api/books/:id/reviews
// @access  Private
router.post(
  '/:id/reviews',
  protect,
  asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    // Check if user already reviewed
    const alreadyReviewed = book.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'Book already reviewed',
      });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    book.reviews.push(review);
    book.calculateRatings();
    await book.save();

    res.status(201).json({
      success: true,
      message: 'Review added',
      data: book,
    });
  })
);

export default router;

