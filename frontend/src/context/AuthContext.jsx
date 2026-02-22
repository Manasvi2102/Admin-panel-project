import { createContext, useContext, useEffect, useState } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Load user from localStorage on mount / refresh ──
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      // Optimistically set user from cache
      setUser(JSON.parse(storedUser));

      // Then verify token is still valid with backend
      api
        .get('/auth/me')
        .then((res) => {
          // Backend: { success: true, data: { ...userFields } }
          const userData = res.data.data || res.data.user;
          if (userData) {
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          }
        })
        .catch(() => {
          // Token invalid/expired — clear everything
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // ── LOGIN: email + password → returns user data with token ──
  // Backend: POST /api/auth/login → { success, message, data: { _id, name, email, role, token } }
  const login = async (email, password) => {
    const res = await api.post('/auth/login', {
      email: email.toLowerCase().trim(),
      password,
    });

    // Backend always returns data inside res.data.data
    const responseData = res.data.data;

    if (!responseData || !responseData.token) {
      throw new Error('Invalid login response from server');
    }

    const userData = {
      _id: responseData._id,
      name: responseData.name,
      email: responseData.email,
      role: responseData.role,
    };

    localStorage.setItem('token', responseData.token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);

    return userData;
  };

  // ── REGISTER: name + email + password → no token returned, OTP sent ──
  // Backend: POST /api/auth/register → { success: true, message: '...' }
  // No token/user in response — user must verify OTP first
  const register = async (userData) => {
    const res = await api.post('/auth/register', {
      name: userData.name,
      email: userData.email.toLowerCase().trim(),
      password: userData.password,
    });

    // Returns: { success: true, message: 'Registration successful! ...' }
    return res.data;
  };

  // ── LOGIN WITH TOKEN: used after OTP verification ──
  // Called by VerifyOtp page when backend returns a token after successful verify
  // Backend: POST /api/auth/verify-otp → { success, message, data: { _id, name, email, role, token } }
  const loginWithToken = (responseData) => {
    if (!responseData || !responseData.token) return;

    const userData = {
      _id: responseData._id,
      name: responseData.name,
      email: responseData.email,
      role: responseData.role,
    };

    localStorage.setItem('token', responseData.token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);

    return userData;
  };

  // ── LOGOUT ──
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // ── UPDATE PROFILE ──
  // Backend: PUT /api/auth/updateprofile → { success: true, data: { ...updatedUser } }
  const updateProfile = async (profileData) => {
    const res = await api.put('/auth/updateprofile', profileData);

    const updatedUser = res.data.data || res.data.user;

    if (updatedUser) {
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }

    return updatedUser;
  };

  const value = {
    user,
    loading,
    login,
    register,
    loginWithToken,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
