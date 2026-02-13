import express from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { protect, authorize } from '../middleware/auth.js';
import { Book } from '../models/Book.js';
import { Order } from '../models/Order.js';
import { User } from '../models/User.js';
import { Category } from '../models/Category.js';

const router = express.Router();

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private/Admin
router.get(
  '/stats',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    // Total books
    const totalBooks = await Book.countDocuments({ isActive: true });
    
    // Low stock books (stock < 10)
    const lowStockBooks = await Book.find({ 
      isActive: true, 
      stock: { $lt: 10 } 
    }).select('title stock');

    // Total orders
    const totalOrders = await Order.countDocuments();
    
    // Total revenue
    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Recent orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort('-createdAt')
      .limit(5);

    // Total users
    const totalUsers = await User.countDocuments({ isActive: true });
    
    // Total customers
    const totalCustomers = await User.countDocuments({ 
      role: 'user', 
      isActive: true 
    });

    // Sales by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlySales = await Order.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo }, paymentStatus: 'paid' } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          total: { $sum: '$total' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Top selling books
    const topSellingBooks = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.book',
          totalSold: { $sum: '$items.quantity' },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    const topBooks = await Book.populate(topSellingBooks, {
      path: '_id',
      select: 'title coverImage price',
    });

    res.json({
      success: true,
      data: {
        overview: {
          totalBooks,
          totalOrders,
          totalRevenue,
          totalUsers,
          totalCustomers,
        },
        lowStockBooks,
        recentOrders,
        monthlySales,
        topSellingBooks: topBooks,
      },
    });
  })
);

export default router;

