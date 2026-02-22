import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import Loading from '../components/Loading';
import { FiMail, FiShield, FiArrowRight, FiRefreshCw } from 'react-icons/fi';

const VerifyOtp = () => {
    // 6-box OTP input state
    const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [countdown, setCountdown] = useState(0); // seconds until resend allowed
    const inputRefs = useRef([]);

    const location = useLocation();
    const navigate = useNavigate();
    const { loginWithToken } = useAuth();

    // Pre-fill email from navigate state
    useEffect(() => {
        if (location.state?.email) {
            setEmail(location.state.email);
        }
    }, [location.state]);

    // Countdown timer for resend button
    useEffect(() => {
        if (countdown <= 0) return;
        const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [countdown]);

    // ── OTP box handlers ──
    const handleDigitChange = (index, value) => {
        // Accept only single digit
        const digit = value.replace(/\D/g, '').slice(-1);
        const newDigits = [...otpDigits];
        newDigits[index] = digit;
        setOtpDigits(newDigits);

        // Auto-focus next box
        if (digit && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const newDigits = [...otpDigits];
        for (let i = 0; i < pasted.length; i++) {
            newDigits[i] = pasted[i];
        }
        setOtpDigits(newDigits);
        // Focus last filled box
        const lastFilled = Math.min(pasted.length, 5);
        inputRefs.current[lastFilled]?.focus();
    };

    const otp = otpDigits.join('');

    // ── Verify OTP ──
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error('Please enter the email address you registered with');
            return;
        }
        if (otp.length !== 6) {
            toast.error('Please enter the complete 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            // Backend: POST /api/auth/verify-otp → { success, message, data: { _id, name, email, role, token } }
            const res = await api.post('/auth/verify-otp', {
                email: email.toLowerCase().trim(),
                otp,
            });

            const responseData = res.data.data;

            if (responseData && responseData.token) {
                // Update AuthContext state without page reload
                loginWithToken(responseData);
                toast.success('Email verified! You are now logged in 🎉');
                navigate('/');
            } else {
                // Shouldn't happen but handle gracefully
                toast.success('Email verified! Please login.');
                navigate('/login');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // ── Resend OTP ──
    const handleResendOtp = async () => {
        if (!email) {
            toast.error('Please enter your email address first');
            return;
        }
        if (countdown > 0) return;

        setResendLoading(true);
        try {
            // Backend: POST /api/auth/resend-otp → { success, message }
            await api.post('/auth/resend-otp', { email: email.toLowerCase().trim() });
            toast.success('OTP resent! Please check your email.');
            setCountdown(60); // 60-second cooldown
            // Clear old OTP inputs
            setOtpDigits(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to resend OTP. Please try again.');
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">

                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                        <FiShield className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
                    <p className="text-gray-600 mb-1">
                        We sent a 6-digit OTP to
                    </p>
                    {email && (
                        <p className="text-primary-600 font-semibold">{email}</p>
                    )}
                </div>

                {/* Form Card */}
                <form
                    className="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
                    onSubmit={handleSubmit}
                >
                    {/* Email input (editable in case user needs to correct it) */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FiMail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-gray-900 placeholder-gray-400 bg-gray-50 focus:bg-white"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* 6-digit OTP boxes */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
                            Enter 6-Digit OTP
                        </label>
                        <div className="flex gap-3 justify-center" onPaste={handlePaste}>
                            {otpDigits.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleDigitChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900"
                                />
                            ))}
                        </div>
                        <p className="text-center text-xs text-gray-400 mt-3">
                            💡 You can paste the OTP directly
                        </p>
                    </div>

                    {/* Verify Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={loading || otp.length !== 6}
                            className="group relative w-full flex justify-center py-4 px-6 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <Loading size="sm" />
                                    <span className="ml-2">Verifying...</span>
                                </div>
                            ) : (
                                <span className="flex items-center">
                                    Verify OTP
                                    <FiArrowRight className="ml-2 w-4 h-4" />
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Resend OTP */}
                    <div className="flex items-center justify-center">
                        <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={resendLoading || countdown > 0}
                            className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            <FiRefreshCw className={`mr-2 h-4 w-4 ${resendLoading ? 'animate-spin' : ''}`} />
                            {countdown > 0
                                ? `Resend OTP in ${countdown}s`
                                : resendLoading
                                    ? 'Sending...'
                                    : "Didn't receive the OTP? Resend"}
                        </button>
                    </div>

                    {/* Back to login */}
                    <div className="text-center">
                        <Link
                            to="/login"
                            className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
                        >
                            ← Back to Login
                        </Link>
                    </div>
                </form>

                {/* Info box */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
                    <p className="font-semibold mb-1">📬 Check these folders if you don't see the email:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Spam / Junk folder</li>
                        <li>Promotions tab (Gmail)</li>
                        <li>The OTP expires in <strong>10 minutes</strong></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default VerifyOtp;
