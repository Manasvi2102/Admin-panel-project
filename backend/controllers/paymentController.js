import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Order } from '../models/Order.js';
import { Cart } from '../models/Cart.js';
import { Book } from '../models/Book.js';

// ── Razorpay instance ──────────────────────────────────────────────────────
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Create a Razorpay order (Step 1 of payment flow)
// @route   POST /api/payment/razorpay/create-order
// @access  Private
// Body:    { shippingAddress }
// Returns: { razorpayOrderId, amount, currency, orderId (our DB order) }
// ─────────────────────────────────────────────────────────────────────────────
export const createRazorpayOrder = async (req, res) => {
    const { shippingAddress } = req.body;

    if (!shippingAddress) {
        return res.status(400).json({ success: false, message: 'Shipping address is required' });
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.book');
    if (!cart || cart.items.length === 0) {
        return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // Validate stock and build order items
    const orderItems = [];
    for (const item of cart.items) {
        const book = await Book.findById(item.book._id);
        if (!book || book.stock < item.quantity) {
            return res.status(400).json({
                success: false,
                message: `Insufficient stock for "${book?.title || 'a book'}"`,
            });
        }
        orderItems.push({
            book: item.book._id,
            quantity: item.quantity,
            price: book.price,
            discount: book.discount || 0,
        });
    }

    // Calculate totals (same formula as regular orders)
    const subtotal = orderItems.reduce((sum, item) => {
        const effectivePrice = item.price * (1 - item.discount / 100);
        return sum + effectivePrice * item.quantity;
    }, 0);

    const shippingCost = subtotal > 50 ? 0 : 5;
    const tax = subtotal * 0.1;
    const total = subtotal + shippingCost + tax;

    // Create our DB order first (status: pending, payment: pending)
    const order = await Order.create({
        user: req.user._id,
        items: orderItems,
        shippingAddress,
        paymentMethod: 'razorpay',
        paymentStatus: 'pending',
        subtotal,
        shippingCost,
        tax,
        total,
    });

    // Create Razorpay order — amount is in PAISE (₹1 = 100 paise)
    const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(total * 100), // convert ₹ → paise
        currency: 'INR',
        receipt: order._id.toString(),
        notes: {
            orderId: order._id.toString(),
            userId: req.user._id.toString(),
        },
    });

    // Save Razorpay order ID to our DB order
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    console.log(`💳 Razorpay order created: ${razorpayOrder.id} for ₹${total.toFixed(2)}`);

    return res.status(201).json({
        success: true,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        orderId: order._id, // our internal order ID
        keyId: process.env.RAZORPAY_KEY_ID,
    });
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Verify Razorpay payment signature (Step 2 — after user pays)
// @route   POST /api/payment/razorpay/verify
// @access  Private
// Body:    { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId }
// ─────────────────────────────────────────────────────────────────────────────
export const verifyRazorpayPayment = async (req, res) => {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !orderId) {
        return res.status(400).json({ success: false, message: 'Missing payment verification fields' });
    }

    // Generate expected signature using HMAC SHA256
    const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

    if (generatedSignature !== razorpaySignature) {
        console.error('❌ Razorpay signature mismatch — possible tamper attempt');
        // Mark order as failed
        await Order.findByIdAndUpdate(orderId, { paymentStatus: 'failed' });
        return res.status(400).json({ success: false, message: 'Payment verification failed. Invalid signature.' });
    }

    // Signature is valid — update order
    const order = await Order.findById(orderId);
    if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.paymentStatus = 'paid';
    order.orderStatus = 'processing';
    order.razorpayPaymentId = razorpayPaymentId;
    await order.save();

    // Deduct stock
    for (const item of order.items) {
        await Book.findByIdAndUpdate(item.book, { $inc: { stock: -item.quantity } });
    }

    // Clear cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
        cart.items = [];
        await cart.save();
    }

    console.log(`✅ Payment verified: ${razorpayPaymentId} → Order ${orderId} marked PAID`);

    return res.status(200).json({
        success: true,
        message: 'Payment verified and order confirmed!',
        data: order,
    });
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Handle payment failure (user cancelled / payment failed)
// @route   POST /api/payment/razorpay/failure
// @access  Private
// Body:    { orderId }
// ─────────────────────────────────────────────────────────────────────────────
export const handlePaymentFailure = async (req, res) => {
    const { orderId } = req.body;

    if (!orderId) {
        return res.status(400).json({ success: false, message: 'Order ID required' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Only update if still pending (not already paid)
    if (order.paymentStatus === 'pending') {
        order.paymentStatus = 'failed';
        order.orderStatus = 'cancelled';
        await order.save();
        console.log(`❌ Payment failed/cancelled for order: ${orderId}`);
    }

    return res.status(200).json({ success: true, message: 'Order marked as failed/cancelled' });
};
