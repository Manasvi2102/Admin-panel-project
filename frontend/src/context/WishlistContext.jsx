import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../utils/api';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setWishlist(null);
    }
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await api.get('/wishlist');
      setWishlist(response.data.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (bookId) => {
    try {
      const response = await api.post('/wishlist', { bookId });
      setWishlist(response.data.data);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  };

  const removeFromWishlist = async (bookId) => {
    try {
      const response = await api.delete(`/wishlist/${bookId}`);
      setWishlist(response.data.data);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  };

  const isInWishlist = (bookId) => {
    if (!wishlist || !wishlist.books) return false;
    return wishlist.books.some((book) => book._id === bookId);
  };

  const value = {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    fetchWishlist,
    isInWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

