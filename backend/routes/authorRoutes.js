import express from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { protect, authorize } from '../middleware/auth.js';
import { Author } from '../models/Author.js';
import { Book } from '../models/Book.js';

const router = express.Router();

// @desc    Get all authors
// @route   GET /api/authors
// @access  Public
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 12, sort = 'name' } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Find authors and populate books to calculate stats
    const authors = await Author.find({})
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate({
        path: 'books',
        model: 'Book',
        select: 'title ratings'
      });

    const totalDocs = await Author.countDocuments({});

    // Calculate average rating and book count for each author
    const authorsWithStats = authors.map(author => {
      const authorObj = author.toObject();
      const bookCount = author.books?.length || 0;
      const averageRating = bookCount > 0
        ? author.books.reduce((sum, book) => sum + (book.ratings?.average || 0), 0) / bookCount
        : 0;

      return {
        ...authorObj,
        bookCount,
        averageRating: parseFloat(averageRating.toFixed(1)),
      };
    });

    res.json({
      success: true,
      data: authorsWithStats,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(totalDocs / parseInt(limit)),
        total: totalDocs,
      },
    });
  })
);

// @desc    Get single author
// @route   GET /api/authors/:id
// @access  Public
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const author = await Author.findById(req.params.id)
      .populate('books', 'title coverImage price ratings createdAt');

    if (!author) {
      return res.status(404).json({
        success: false,
        message: 'Author not found',
      });
    }

    // Calculate stats
    const bookCount = author.books?.length || 0;
    const averageRating = bookCount > 0
      ? author.books.reduce((sum, book) => sum + (book.ratings?.average || 0), 0) / bookCount
      : 0;

    res.json({
      success: true,
      data: {
        ...author.toObject(),
        bookCount,
        averageRating: parseFloat(averageRating.toFixed(1)),
      },
    });
  })
);

// @desc    Create new author
// @route   POST /api/authors
// @access  Private/Admin
router.post(
  '/',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const author = await Author.create(req.body);

    res.status(201).json({
      success: true,
      data: author,
    });
  })
);

// @desc    Update author
// @route   PUT /api/authors/:id
// @access  Private/Admin
router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const author = await Author.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!author) {
      return res.status(404).json({
        success: false,
        message: 'Author not found',
      });
    }

    res.json({
      success: true,
      data: author,
    });
  })
);

// @desc    Delete author
// @route   DELETE /api/authors/:id
// @access  Private/Admin
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const author = await Author.findById(req.params.id);

    if (!author) {
      return res.status(404).json({
        success: false,
        message: 'Author not found',
      });
    }

    await author.deleteOne();

    res.json({
      success: true,
      message: 'Author deleted successfully',
    });
  })
);

export default router;
