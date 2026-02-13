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

  // Load user from localStorage on refresh
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));

      // Verify token
      api
        .get('/auth/me')
        .then((res) => {
          const userData = res.data.user || res.data.data;
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // LOGIN
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });

    // Backend returns: { success: true, data: { token, _id, name, email, role } }
    const responseData = res.data.data || res.data;
    const token = responseData.token || res.data.token;
    const userData = responseData.user || {
      _id: responseData._id,
      name: responseData.name,
      email: responseData.email,
      role: responseData.role,
    };

    if (!token || !userData) {
      throw new Error('Invalid login response');
    }

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));

    setUser(userData);
    return userData;
  };

  // REGISTER
  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);

    // Backend returns: { success: true, data: { token, _id, name, email, role } }
    const responseData = res.data.data || res.data;
    const token = responseData.token || res.data.token;
    const user = responseData.user || {
      _id: responseData._id,
      name: responseData.name,
      email: responseData.email,
      role: responseData.role,
    };

    if (!token || !user) {
      throw new Error('Invalid registration response');
    }

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    setUser(user);
    return user;
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // UPDATE PROFILE
  const updateProfile = async (profileData) => {
    const res = await api.put('/auth/updateprofile', profileData);

    const updatedUser = res.data.user || res.data.data;

    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));

    return updatedUser;
  };

  const value = {
    user,
    loading,
    login,
    register,
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
