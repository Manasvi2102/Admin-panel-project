import express from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { protect } from '../middleware/auth.js';
import {
  registerUser,
  verifyOTP,
  resendOTP,
  loginUser,
  getMe,
  updateProfile,
  updatePassword,
} from '../controllers/authController.js';

const router = express.Router();

// ──────────────────────────────────────────────────────────
// Public routes
// ──────────────────────────────────────────────────────────

// POST /api/auth/register  → name, email, password (sends OTP)
router.post('/register', asyncHandler(registerUser));

// POST /api/auth/verify-otp  → email, otp
router.post('/verify-otp', asyncHandler(verifyOTP));

// POST /api/auth/resend-otp  → email
router.post('/resend-otp', asyncHandler(resendOTP));

// POST /api/auth/login  → email, password
router.post('/login', asyncHandler(loginUser));

// ──────────────────────────────────────────────────────────
// Private routes (JWT required)
// ──────────────────────────────────────────────────────────

// GET  /api/auth/me
router.get('/me', protect, asyncHandler(getMe));

// PUT  /api/auth/updateprofile
router.put('/updateprofile', protect, asyncHandler(updateProfile));

// PUT  /api/auth/updatepassword
router.put('/updatepassword', protect, asyncHandler(updatePassword));

// GET  /api/auth/test
router.get('/test', (req, res) => res.json({ success: true, message: 'Auth API is working' }));

export default router;
