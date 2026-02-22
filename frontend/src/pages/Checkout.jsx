import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../utils/api';
import Loading from '../components/Loading';
import toast from 'react-hot-toast';
import {
  FiMapPin,
  FiCreditCard,
  FiShoppingBag,
  FiTruck,
  FiShield,
  FiCheckCircle,
} from 'react-icons/fi';

// ── Load Razorpay checkout script dynamically ──────────────────────────────
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (document.querySelector('script[src*="razorpay"]')) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

// ── Payment method config ──────────────────────────────────────────────────
const PAYMENT_METHODS = [
  {
    id: 'razorpay',
    label: 'Pay Online',
    desc: 'UPI, Cards, Net Banking, Wallets',
    icon: '💳',
    badge: 'Recommended',
    badgeColor: 'bg-green-100 text-green-700',
  },
  {
    id: 'cash',
    label: 'Cash on Delivery',
    desc: 'Pay when your order arrives',
    icon: '💵',
    badge: null,
  },
];

const Checkout = () => {
  const { user } = useAuth();
  const { cart, getCartTotal, clearCart, fetchCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || 'India',
    paymentMethod: 'razorpay',
  });

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchCart();
    // Pre-load Razorpay script in background
    loadRazorpayScript();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const shippingAddress = {
    street: formData.street,
    city: formData.city,
    state: formData.state,
    zipCode: formData.zipCode,
    country: formData.country,
  };

  // ── Cash on Delivery flow ─────────────────────────────────────────────────
  const handleCOD = async () => {
    setLoading(true);
    try {
      const response = await api.post('/orders', {
        shippingAddress,
        paymentMethod: 'cash',
      });
      await clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate(`/orders/${response.data.data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  // ── Razorpay online payment flow ──────────────────────────────────────────
  const handleRazorpayPayment = async () => {
    setLoading(true);

    // 1. Load Razorpay script
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error('Failed to load Razorpay. Please check your internet connection.');
      setLoading(false);
      return;
    }

    try {
      // 2. Create order in our DB + Razorpay
      const { data } = await api.post('/payment/razorpay/create-order', { shippingAddress });

      if (!data.success) {
        toast.error(data.message || 'Could not create payment order');
        setLoading(false);
        return;
      }

      // 3. Open Razorpay checkout popup
      const options = {
        key: data.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,          // in paise
        currency: data.currency,
        name: 'BookNest',
        description: 'Book Purchase',
        image: '/books-logo.svg',
        order_id: data.razorpayOrderId,
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: { color: '#4f46e5' },

        // ── Payment SUCCESS ──────────────────────────────────────────────────
        handler: async (response) => {
          try {
            const verifyRes = await api.post('/payment/razorpay/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderId: data.orderId,
            });

            if (verifyRes.data.success) {
              await clearCart();
              toast.success('Payment successful! Order confirmed 🎉');
              navigate(`/orders/${data.orderId}`);
            } else {
              toast.error('Payment verification failed. Contact support.');
            }
          } catch {
            toast.error('Payment verification error. Please contact support.');
          } finally {
            setLoading(false);
          }
        },

        // ── Modal CLOSED without payment ─────────────────────────────────────
        modal: {
          ondismiss: async () => {
            try {
              await api.post('/payment/razorpay/failure', { orderId: data.orderId });
              toast.error('Payment cancelled.');
            } catch { /* ignore */ }
            setLoading(false);
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);

      // ── Payment FAILURE event ────────────────────────────────────────────
      razorpayInstance.on('payment.failed', async (response) => {
        console.error('Razorpay payment failed:', response.error);
        try {
          await api.post('/payment/razorpay/failure', { orderId: data.orderId });
        } catch { /* ignore */ }
        toast.error(`Payment failed: ${response.error?.description || 'Unknown error'}`);
        setLoading(false);
      });

      razorpayInstance.open();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment initialization failed');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate address
    if (!formData.street || !formData.city || !formData.state || !formData.zipCode || !formData.country) {
      toast.error('Please fill in all shipping address fields');
      return;
    }

    if (formData.paymentMethod === 'razorpay') {
      await handleRazorpayPayment();
    } else {
      await handleCOD();
    }
  };

  // ── Empty cart guard ───────────────────────────────────────────────────────
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FiShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some books before checking out</p>
          <button
            onClick={() => navigate('/books')}
            className="bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition"
          >
            Browse Books
          </button>
        </div>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 5;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-primary-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-500 mt-1">Complete your order</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Left column: Address + Payment ── */}
            <div className="lg:col-span-2 space-y-6">

              {/* Shipping Address */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center mb-5">
                  <div className="w-9 h-9 bg-primary-100 rounded-xl flex items-center justify-center mr-3">
                    <FiMapPin className="w-5 h-5 text-primary-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Shipping Address</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Street Address *</label>
                    <input
                      type="text" name="street" required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50 focus:bg-white transition"
                      placeholder="123 Main Street"
                      value={formData.street} onChange={handleChange}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">City *</label>
                      <input
                        type="text" name="city" required
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50 focus:bg-white transition"
                        placeholder="Mumbai"
                        value={formData.city} onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">State *</label>
                      <input
                        type="text" name="state" required
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50 focus:bg-white transition"
                        placeholder="Maharashtra"
                        value={formData.state} onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">ZIP / PIN Code *</label>
                      <input
                        type="text" name="zipCode" required
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50 focus:bg-white transition"
                        placeholder="400001"
                        value={formData.zipCode} onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Country *</label>
                      <input
                        type="text" name="country" required
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50 focus:bg-white transition"
                        placeholder="India"
                        value={formData.country} onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center mb-5">
                  <div className="w-9 h-9 bg-primary-100 rounded-xl flex items-center justify-center mr-3">
                    <FiCreditCard className="w-5 h-5 text-primary-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
                </div>

                <div className="space-y-3">
                  {PAYMENT_METHODS.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${formData.paymentMethod === method.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={formData.paymentMethod === method.id}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 mr-4 flex-shrink-0 flex items-center justify-center transition-all ${formData.paymentMethod === method.id
                          ? 'border-primary-500 bg-primary-500'
                          : 'border-gray-300'
                        }`}>
                        {formData.paymentMethod === method.id && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                      <span className="text-2xl mr-4">{method.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">{method.label}</span>
                          {method.badge && (
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${method.badgeColor}`}>
                              {method.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{method.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Razorpay info box */}
                {formData.paymentMethod === 'razorpay' && (
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <FiShield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-700">
                        <p className="font-semibold mb-1">Secure Payment via Razorpay</p>
                        <p>Pay using UPI, Credit/Debit Card, Net Banking, or Wallet. Your payment information is encrypted and secure.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Right column: Order Summary ── */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-20">
                <div className="flex items-center mb-5">
                  <div className="w-9 h-9 bg-primary-100 rounded-xl flex items-center justify-center mr-3">
                    <FiShoppingBag className="w-5 h-5 text-primary-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
                </div>

                {/* Items */}
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-1">
                  {cart.items.map((item) => {
                    const book = item.book;
                    const price = book.discount > 0
                      ? book.price * (1 - book.discount / 100)
                      : book.price;
                    return (
                      <div key={item._id} className="flex justify-between items-start gap-2 text-sm">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 truncate">{book.title}</p>
                          <p className="text-gray-400">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-semibold text-gray-900 whitespace-nowrap">
                          ₹{(price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Totals */}
                <div className="border-t pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <div className="flex items-center gap-1">
                      <FiTruck className="w-4 h-4" />
                      <span>Shipping</span>
                    </div>
                    {shipping === 0
                      ? <span className="text-green-600 font-medium">Free</span>
                      : <span>₹{shipping.toFixed(2)}</span>
                    }
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (10%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                </div>

                {shipping === 0 && (
                  <div className="mt-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-xs text-green-700 flex items-center gap-2">
                    <FiCheckCircle className="w-4 h-4" />
                    You qualify for FREE shipping!
                  </div>
                )}

                {/* Total */}
                <div className="border-t mt-4 pt-4">
                  <div className="flex justify-between text-xl font-bold text-gray-900 mb-5">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.01]"
                  >
                    {loading ? (
                      <>
                        <Loading size="sm" />
                        <span>
                          {formData.paymentMethod === 'razorpay' ? 'Opening Payment...' : 'Placing Order...'}
                        </span>
                      </>
                    ) : (
                      <>
                        {formData.paymentMethod === 'razorpay' ? (
                          <>💳 Pay ₹{total.toFixed(2)} Online</>
                        ) : (
                          <>📦 Place Order (COD)</>
                        )}
                      </>
                    )}
                  </button>

                  {/* Trust badges */}
                  <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <FiShield className="w-3.5 h-3.5" />
                      <span>Secure</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiTruck className="w-3.5 h-3.5" />
                      <span>Fast Delivery</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiCheckCircle className="w-3.5 h-3.5" />
                      <span>Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
