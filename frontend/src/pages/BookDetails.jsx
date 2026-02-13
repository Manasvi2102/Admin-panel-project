import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import toast from 'react-hot-toast';
import { FiHeart, FiShoppingCart, FiStar, FiArrowLeft } from 'react-icons/fi';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/books/${id}`);
      setBook(response.data.data);
    } catch (err) {
      setError('Book not found');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    try {
      await addToCart(book._id, quantity);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      navigate('/login');
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

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to submit a review');
      return;
    }
    setSubmittingReview(true);
    try {
      await api.post(`/books/${id}/reviews`, reviewForm);
      toast.success('Review submitted!');
      setReviewForm({ rating: 5, comment: '' });
      fetchBook(); // Refresh book data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message={error || 'Book not found'} />
      </div>
    );
  }

  const discountedPrice = book.discount > 0 
    ? book.price * (1 - book.discount / 100) 
    : book.price;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft className="mr-2" />
          Back
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Book Image */}
            <div>
              <img
                src={book.coverImage || 'https://via.placeholder.com/500x700?text=Book+Cover'}
                alt={book.title}
                className="w-full rounded-lg shadow-md"
              />
            </div>

            {/* Book Info */}
            <div>
              <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
              <p className="text-xl text-gray-600 mb-4">by {book.author?.name || 'Unknown Author'}</p>

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center mr-2">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(book.ratings?.average || 0)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {book.ratings?.average || 0} ({book.ratings?.count || 0} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                {book.discount > 0 ? (
                  <div>
                    <span className="text-4xl font-bold text-primary-600">
                      ₹{discountedPrice.toFixed(2)}
                    </span>
                    <span className="text-xl text-gray-500 line-through ml-3">
                      ₹{book.price.toFixed(2)}
                    </span>
                    <span className="ml-3 bg-red-500 text-white px-2 py-1 rounded text-sm">
                      Save {book.discount}%
                    </span>
                  </div>
                ) : (
                  <span className="text-4xl font-bold text-primary-600">
                    ₹{book.price.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Book Details */}
              <div className="space-y-2 mb-6 text-gray-700">
                <p><strong>ISBN:</strong> {book.isbn}</p>
                <p><strong>Publisher:</strong> {book.publisher || 'N/A'}</p>
                <p><strong>Published:</strong> {book.publishYear || 'N/A'}</p>
                <p><strong>Pages:</strong> {book.pages || 'N/A'}</p>
                <p><strong>Language:</strong> {book.language}</p>
                <p><strong>Format:</strong> {book.format}</p>
                <p><strong>Stock:</strong> {book.stock > 0 ? `${book.stock} available` : 'Out of stock'}</p>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{book.description}</p>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="font-medium">Quantity:</label>
                  <input
                    type="number"
                    min="1"
                    max={book.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(book.stock, parseInt(e.target.value) || 1)))}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={book.stock === 0}
                    className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <FiShoppingCart />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    onClick={handleWishlistToggle}
                    className={`px-6 py-3 rounded-md border-2 transition ${
                      isInWishlist(book._id)
                        ? 'border-red-500 text-red-500 bg-red-50'
                        : 'border-gray-300 text-gray-600 hover:border-primary-600 hover:text-primary-600'
                    }`}
                  >
                    <FiHeart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="border-t p-8">
            <h2 className="text-2xl font-bold mb-6">Reviews</h2>

            {/* Review Form */}
            {isAuthenticated && (
              <form onSubmit={handleSubmitReview} className="mb-8 bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-4">Write a Review</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Rating</label>
                  <select
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) })}
                    className="border border-gray-300 rounded-md px-3 py-2"
                  >
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <option key={rating} value={rating}>
                        {rating} Star{rating > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Comment</label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    rows="4"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Share your thoughts about this book..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition disabled:bg-gray-400"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}

            {/* Reviews List */}
            {book.reviews && book.reviews.length > 0 ? (
              <div className="space-y-4">
                {book.reviews.map((review) => (
                  <div key={review._id} className="border-b pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="flex items-center mr-2">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-semibold">{review.user?.name || 'Anonymous'}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {review.comment && <p className="text-gray-700 mt-2">{review.comment}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No reviews yet. Be the first to review!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;

