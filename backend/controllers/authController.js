import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';

// ─────────────────────────────────────────────
// Helper: generate & hash a 6-digit OTP
// ─────────────────────────────────────────────
const generateOTP = async () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(otp, salt);
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    return { otp, hashedOTP, otpExpires };
};

// ─────────────────────────────────────────────
// Helper: try to send email, log error but don't crash
// ─────────────────────────────────────────────
const trySendEmail = async (options) => {
    try {
        await sendEmail(options);
        return { sent: true };
    } catch (err) {
        console.error('📧 Email send failed:', err.message, '| Code:', err.code || 'N/A');
        return { sent: false, error: err.message };
    }
};

// ─────────────────────────────────────────────
// @desc    Register a new user & send OTP
// @route   POST /api/auth/register
// @access  Public
// Required fields: name, email, password
// ─────────────────────────────────────────────
export const registerUser = async (req, res) => {
    const { name, password } = req.body;

    if (!name || !req.body.email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Please provide name, email and password',
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 6 characters',
        });
    }

    const email = req.body.email.toLowerCase().trim();

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        // Not yet verified → resend OTP
        if (!userExists.isVerified) {
            const { otp, hashedOTP, otpExpires } = await generateOTP();
            userExists.otp = hashedOTP;
            userExists.otpExpires = otpExpires;
            await userExists.save();


            const { sent } = await trySendEmail({
                email: userExists.email,
                subject: 'BookNest – Account Verification OTP',
                message: `Your verification code is: ${otp}. It expires in 10 minutes.`,
                html: `
          <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:32px;border-radius:12px;border:1px solid #e2e8f0">
            <h2 style="color:#4f46e5">BookNest</h2>
            <p>Hello <strong>${userExists.name}</strong>,</p>
            <p>Your account is not verified yet. Use the OTP below to verify your email:</p>
            <div style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#4f46e5;text-align:center;padding:16px 0">${otp}</div>
            <p style="color:#64748b;font-size:13px">This code expires in <strong>10 minutes</strong>.</p>
          </div>
        `,
            });

            return res.status(200).json({
                success: true,
                message: sent
                    ? 'Account already registered but not verified. OTP resent to your email.'
                    : 'Account already registered but not verified. Email send failed — check server config. OTP saved.',
                emailSent: sent,
            });
        }

        // Fully verified → already a member
        return res.status(400).json({
            success: false,
            message: 'An account with this email already exists. Please login.',
        });
    }

    // ── Create new user ──
    const { otp, hashedOTP, otpExpires } = await generateOTP();

    const user = await User.create({
        name: name.trim(),
        email,
        password,
        otp: hashedOTP,
        otpExpires,
        isVerified: false,
    });

    if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid user data' });
    }



    const { sent } = await trySendEmail({
        email: user.email,
        subject: 'BookNest – Verify Your Account',
        message: `Your verification code is: ${otp}. It expires in 10 minutes.`,
        html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:32px;border-radius:12px;border:1px solid #e2e8f0">
        <h2 style="color:#4f46e5">Welcome to BookNest! 📚</h2>
        <p>Hello <strong>${user.name}</strong>,</p>
        <p>Thank you for registering. Please verify your email using the OTP below:</p>
        <div style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#4f46e5;text-align:center;padding:16px 0">${otp}</div>
        <p style="color:#64748b;font-size:13px">This code expires in <strong>10 minutes</strong>.</p>
      </div>
    `,
    });

    return res.status(201).json({
        success: true,
        message: sent
            ? 'Registration successful! Please check your email for the verification OTP.'
            : 'Registration successful! However, the verification email could not be sent. Please check the server email configuration.',
        emailSent: sent,
    });
};

// ─────────────────────────────────────────────
// @desc    Verify OTP after registration
// @route   POST /api/auth/verify-otp
// @access  Public
// Required fields: email, otp
// ─────────────────────────────────────────────
export const verifyOTP = async (req, res) => {
    const { otp } = req.body;

    if (!req.body.email || !otp) {
        return res.status(400).json({ success: false, message: 'Please provide email and OTP' });
    }

    const email = req.body.email.toLowerCase().trim();
    const user = await User.findOne({ email }).select('+otp +otpExpires');

    if (!user) {
        return res.status(404).json({ success: false, message: 'No account found with this email' });
    }

    if (user.isVerified) {
        return res.status(400).json({ success: false, message: 'Account is already verified. Please login.' });
    }

    if (!user.otp || !user.otpExpires) {
        return res.status(400).json({ success: false, message: 'No OTP found. Please request a new one.' });
    }

    if (user.otpExpires < Date.now()) {
        return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Invalid OTP. Please try again.' });
    }

    // Mark as verified & clear OTP
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = generateToken(user._id);
    console.log('✅ Email verified:', email);

    return res.status(200).json({
        success: true,
        message: 'Email verified successfully! You are now logged in.',
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
        },
    });
};

// ─────────────────────────────────────────────
// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
// Required fields: email
// ─────────────────────────────────────────────
export const resendOTP = async (req, res) => {
    if (!req.body.email) {
        return res.status(400).json({ success: false, message: 'Please provide your email' });
    }

    const email = req.body.email.toLowerCase().trim();
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ success: false, message: 'No account found with this email' });
    }

    if (user.isVerified) {
        return res.status(400).json({ success: false, message: 'Account is already verified. Please login.' });
    }

    const { otp, hashedOTP, otpExpires } = await generateOTP();
    user.otp = hashedOTP;
    user.otpExpires = otpExpires;
    await user.save();



    const { sent } = await trySendEmail({
        email: user.email,
        subject: 'BookNest – Resend Verification OTP',
        message: `Your new verification code is: ${otp}. It expires in 10 minutes.`,
        html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:32px;border-radius:12px;border:1px solid #e2e8f0">
        <h2 style="color:#4f46e5">BookNest</h2>
        <p>Hello <strong>${user.name}</strong>,</p>
        <p>Here is your new OTP:</p>
        <div style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#4f46e5;text-align:center;padding:16px 0">${otp}</div>
        <p style="color:#64748b;font-size:13px">This code expires in <strong>10 minutes</strong>.</p>
      </div>
    `,
    });

    return res.status(200).json({
        success: true,
        message: sent
            ? 'OTP resent successfully. Please check your email.'
            : 'OTP generated but email could not be sent. Please check the server email configuration.',
        emailSent: sent,
    });
};

// ─────────────────────────────────────────────
// @desc    Login with email & password
// @route   POST /api/auth/login
// @access  Public
// Required fields: email, password
// ─────────────────────────────────────────────
export const loginUser = async (req, res) => {
    const { password } = req.body;

    if (!req.body.email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const email = req.body.email.toLowerCase().trim();
    console.log('Login attempt:', email);

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        console.log('Login failed: user not found –', email);
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        console.log('Login failed: wrong password –', email);
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.isVerified) {
        console.log('Login failed: not verified –', email);
        return res.status(401).json({
            success: false,
            message: 'Please verify your email first. Check your inbox for the OTP.',
        });
    }

    if (!user.isActive) {
        console.log('Login failed: account inactive –', email);
        return res.status(401).json({ success: false, message: 'Your account has been deactivated. Contact support.' });
    }

    const token = generateToken(user._id);
    console.log('✅ Login successful –', email);

    return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
        },
    });
};

// ─────────────────────────────────────────────
// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private (requires JWT)
// ─────────────────────────────────────────────
export const getMe = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({ success: true, data: user });
};

// ─────────────────────────────────────────────
// @desc    Update profile (name, email, phone, address)
// @route   PUT /api/auth/updateprofile
// @access  Private (requires JWT)
// ─────────────────────────────────────────────
export const updateProfile = async (req, res) => {
    const { name, email, phone, address } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.name = name || user.name;
    user.email = email ? email.toLowerCase().trim() : user.email;
    user.phone = phone || user.phone;

    if (address) {
        user.address = { ...user.address, ...address };
    }

    const updatedUser = await user.save();
    return res.status(200).json({ success: true, data: updatedUser });
};

// ─────────────────────────────────────────────
// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private (requires JWT)
// Required fields: currentPassword, newPassword
// ─────────────────────────────────────────────
export const updatePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, message: 'Please provide current and new password' });
    }

    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({ success: true, message: 'Password updated successfully' });
};
