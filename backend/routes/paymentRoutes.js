import express from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { protect } from '../middleware/auth.js';
import {
    createRazorpayOrder,
    verifyRazorpayPayment,
    handlePaymentFailure,
} from '../controllers/paymentController.js';

const router = express.Router();

// All payment routes require authentication
router.use(protect);

// POST /api/payment/razorpay/create-order → create DB order + Razorpay order
router.post('/razorpay/create-order', asyncHandler(createRazorpayOrder));

// POST /api/payment/razorpay/verify → verify signature, mark order paid
router.post('/razorpay/verify', asyncHandler(verifyRazorpayPayment));

// POST /api/payment/razorpay/failure → mark order as failed/cancelled
router.post('/razorpay/failure', asyncHandler(handlePaymentFailure));

export default router;
