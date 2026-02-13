import express from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { protect, authorize } from '../middleware/auth.js';
import { Category } from '../models/Category.js';

const router = express.Router();

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const categories = await Category.find({ isActive: true }).sort('name');

    res.json({
      success: true,
      count: categories.length,
      data: categories,
    });
  })
);

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.json({
      success: true,
      data: category,
    });
  })
);

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
router.post(
  '/',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const category = await Category.create(req.body);

    res.status(201).json({
      success: true,
      data: category,
    });
  })
);

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
router.put(
  '/:id',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: category,
    });
  })
);

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    category.isActive = false;
    await category.save();

    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  })
);

export default router;

