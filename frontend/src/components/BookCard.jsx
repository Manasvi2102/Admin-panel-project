import { Link } from 'react-router-dom';
import { FiShoppingCart, FiEye, FiStar, FiTrendingUp, FiHeart } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import toast from 'react-hot-toast';

const BookCard = ({ book }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const discountedPrice = book.discount > 0 
    ? book.price * (1 - book.discount / 100) 
    : book.price;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    try {
      await addToCart(book._id, 1);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      return;
    }
    try {
      if (isInWishlist(book._id)) {
        await removeFromWishlist(book._id);
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist(book._id);
        toast.success('Added to wishlist!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update wishlist');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 group h-full flex flex-col overflow-hidden transform hover:-translate-y-1 hover:scale-[1.01] w-full max-w-sm mx-auto">
      <Link to={`/books/${book._id}`} className="block">
        <div className="relative overflow-hidden rounded-t-xl">
          <img
            src={book.coverImage || 'https://via.placeholder.com/300x400?text=Book+Cover'}
            alt={book.title}
            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Enhanced Badges */}
          <div className="absolute top-3 left-3 flex flex-col space-y-2">
            {book.bestSeller && (
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center border border-white/20">
                <FiTrendingUp className="w-3 h-3 mr-1" />
                Bestseller
              </span>
            )}
            {book.featured && (
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md border border-white/20">
                Featured
              </span>
            )}
          </div>

          {book.discount > 0 && (
            <span className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md border border-white/20">
              -{book.discount}% OFF
            </span>
          )}

          {/* Enhanced Quick actions overlay - hide for admin */}
          {!isAdmin && (
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex space-x-2">
              <button
                onClick={handleWishlistToggle}
                className={`p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 border backdrop-blur-sm ${
                  isInWishlist(book._id)
                    ? 'bg-red-500 text-white border-red-400 hover:bg-red-600 shadow-red-500/25'
                    : 'bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-300 border-white/30 dark:border-gray-600/30 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300'
                }`}
              >
                <FiHeart className={`w-5 h-5 ${isInWishlist(book._id) ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = `/books/${book._id}`;
                }}
                className="p-3 rounded-full bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-300 shadow-lg hover:text-blue-600 dark:hover:text-blue-400 backdrop-blur-sm transition-all duration-300 transform hover:scale-110 border border-white/30 dark:border-gray-600/30 hover:border-blue-300"
              >
                <FiEye className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </Link>
      <div className="p-5 flex-1 flex flex-col min-h-[200px]">
        <Link to={`/books/${book._id}`}>
          <h3 className="font-bold text-lg mb-2 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 leading-tight text-gray-900 dark:text-white min-h-[3.5rem] flex items-start">
            {book.title}
          </h3>
        </Link>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 font-medium">
          by {book.author?.name || 'Unknown Author'}
        </p>

        {/* Enhanced Rating */}
        <div className="flex items-center mb-4">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                className={`w-4 h-4 transition-colors duration-300 ${
                  i < Math.floor(book.ratings?.average || 0)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2 font-medium">
            ({book.ratings?.count || 0})
          </span>
        </div>

        {/* Enhanced Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {book.discount > 0 ? (
              <>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  ₹{discountedPrice.toFixed(2)}
                </span>
                <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                  ₹{book.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                ₹{book.price.toFixed(2)}
              </span>
            )}
          </div>
          <div className="text-right">
            <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${
              book.stock > 10
                ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700'
                : book.stock > 0
                ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700'
                : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700'
            }`}>
              {book.stock > 10 ? 'In Stock' : book.stock > 0 ? `${book.stock} left` : 'Out of Stock'}
            </span>
          </div>
        </div>

        {/* Enhanced Add to Cart Button - hide for admin */}
        {!isAdmin && (
          <button
            onClick={handleAddToCart}
            disabled={book.stock === 0}
            className={`w-full py-3 px-4 rounded-lg font-bold transition-all duration-300 flex items-center justify-center space-x-2 shadow-md mt-auto transform hover:scale-105 ${
              book.stock === 0
                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-lg dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 active:scale-95'
            }`}
          >
            <FiShoppingCart className="w-5 h-5" />
            <span>{book.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default BookCard;

