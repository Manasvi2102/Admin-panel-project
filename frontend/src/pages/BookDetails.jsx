import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import toast from 'react-hot-toast';
import { FiHeart, FiShoppingCart, FiStar, FiArrowLeft, FiBook, FiShoppingBag, FiDatabase } from 'react-icons/fi';

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
    <div className="min-h-screen bg-[#fcfdfe] pt-28 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Navigation / Protocol Link */}
        <button
          onClick={() => navigate(-1)}
          className="group mb-10 inline-flex items-center gap-3 px-6 py-3 bg-white rounded-2xl border border-slate-100 text-slate-900 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-slate-900 hover:text-white transition-all duration-500 shadow-sm"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span>Exit To Archive</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

          {/* Left: Artifact Visualizer (Book Image) */}
          <div className="lg:col-span-5 sticky top-32">
            <div className="relative group">
              <div className="aspect-[3/4] rounded-[3rem] overflow-hidden bg-slate-100 shadow-2xl transition-all duration-700 group-hover:scale-[1.02]">
                <img
                  src={book.coverImage || 'https://images.unsplash.com/photo-1543004218-ee141104e14f?auto=format&fit=crop&q=80&w=800'}
                  alt={book.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>

              {/* Artifact ID Badge */}
              <div className="absolute -top-4 -right-4 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-xl rotate-3 group-hover:rotate-0 transition-transform">
                Artifact #{book.isbn?.slice(-4) || 'NULL'}
              </div>

              {/* Decorative Elements */}
              <div className="absolute -z-10 -bottom-10 -left-10 w-40 h-40 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
            </div>
          </div>

          {/* Right: Metadata & Operations */}
          <div className="lg:col-span-7 space-y-12">

            {/* Header Metadata */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 bg-indigo-50 text-indigo-600 px-5 py-2 rounded-full border border-indigo-100">
                <FiBook size={14} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">{book.format || 'Standard Edition'}</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter italic uppercase leading-[0.9]">
                {book.title}
              </h1>

              <div className="flex flex-wrap items-center gap-8">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Origin Source</span>
                  <span className="text-xl font-bold text-slate-900 italic">by {book.author?.name || 'Unknown Author'}</span>
                </div>

                <div className="h-10 w-px bg-slate-200 hidden md:block"></div>

                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">User Feedback</span>
                  <div className="flex items-center gap-3">
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          size={16}
                          className={i < Math.floor(book.ratings?.average || 0) ? 'fill-current' : 'text-slate-200'}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-black text-slate-900">({book.ratings?.count || 0})</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-slate-200 to-transparent w-full"></div>

            {/* Price & Primary Acquisition */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl space-y-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-[0.03] select-none pointer-events-none">
                <FiShoppingBag size={150} />
              </div>

              <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] mb-3 block">Valuation Status</span>
                  <div className="flex items-baseline gap-4">
                    {book.discount > 0 ? (
                      <>
                        <span className="text-6xl font-black text-slate-900 italic tracking-tighter">₹{discountedPrice.toFixed(0)}</span>
                        <span className="text-2xl font-bold text-slate-300 line-through tracking-tighter">₹{book.price}</span>
                        <span className="bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest border border-emerald-500/20">-{book.discount}% OFF</span>
                      </>
                    ) : (
                      <span className="text-6xl font-black text-slate-900 italic tracking-tighter">₹{book.price}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                  <span className="pl-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">QTY</span>
                  <input
                    type="number"
                    min="1"
                    max={book.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(book.stock, parseInt(e.target.value) || 1)))}
                    className="w-16 h-12 bg-white border-none rounded-xl text-center font-black focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                <button
                  onClick={handleAddToCart}
                  disabled={book.stock === 0}
                  className="flex-1 px-10 py-6 bg-slate-900 text-white rounded-[1.8rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-indigo-600 transition-all duration-500 shadow-2xl shadow-indigo-600/20 flex items-center justify-center gap-4 group disabled:bg-slate-300 disabled:shadow-none"
                >
                  <FiShoppingCart className="group-hover:translate-x-1 transition-transform" />
                  {book.stock === 0 ? 'Out of Index' : 'Initialize Acquisition'}
                </button>
                <button
                  onClick={handleWishlistToggle}
                  className={`px-8 py-6 rounded-[1.8rem] border-2 transition-all duration-500 flex items-center justify-center ${isInWishlist(book._id)
                    ? 'border-rose-500 bg-rose-50 text-rose-500 shadow-rose-200 shadow-lg'
                    : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-indigo-600 hover:text-indigo-600'
                    }`}
                >
                  <FiHeart className={isInWishlist(book._id) ? 'fill-current' : ''} size={22} />
                </button>
              </div>
            </div>

            {/* Archival Details Grid */}
            <section className="space-y-8">
              <h3 className="text-xl font-black text-slate-900 italic uppercase tracking-tighter">Technical Specifications</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  { label: 'ISBN Identifier', val: book.isbn },
                  { label: 'Deployment Year', val: book.publishYear },
                  { label: 'Data Registry', val: book.publisher },
                  { label: 'Volume Volume', val: `${book.pages} Pages` },
                  { label: 'Language Node', val: book.language },
                  { label: 'Index Category', val: book.category?.name || 'Literature' }
                ].map((item, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 hover:shadow-md transition-all">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{item.label}</p>
                    <p className="text-sm font-bold text-slate-900 italic">{item.val || 'N/A'}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Summary / Abstract */}
            <section className="space-y-6">
              <h3 className="text-xl font-black text-slate-900 italic uppercase tracking-tighter">Abstract / Synopsis</h3>
              <div className="bg-slate-900/5 p-8 rounded-[2.5rem] border border-slate-100 relative">
                <p className="text-slate-600 font-medium leading-[1.8] text-lg italic">
                  "{book.description}"
                </p>
                {/* Visual Accent */}
                <div className="absolute top-6 left-6 opacity-10">
                  <FiBook size={40} />
                </div>
              </div>
            </section>

            {/* Feedback Core (Reviews) */}
            <section className="pt-20 space-y-12">
              <div className="flex items-center justify-between">
                <h3 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">Feedback Core</h3>
                <span className="bg-slate-900 text-white px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-widest">{book.reviews?.length || 0} Entries</span>
              </div>

              {/* Review Submission */}
              {isAuthenticated && (
                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl space-y-8 border-t-4 border-t-indigo-600">
                  <div>
                    <h4 className="text-xl font-black text-slate-900 italic uppercase tracking-tight">Post Your Analysis</h4>
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-widest mt-1">Authenticated Entry Required</p>
                  </div>

                  <form onSubmit={handleSubmitReview} className="space-y-6">
                    <div className="flex items-center gap-6">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Calibration</span>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setReviewForm({ ...reviewForm, rating: r })}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${reviewForm.rating >= r ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-50 text-slate-300'
                              }`}
                          >
                            <FiStar className={reviewForm.rating >= r ? 'fill-current' : ''} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="relative">
                      <textarea
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        rows="4"
                        className="w-full bg-slate-50 border-none rounded-3xl p-8 text-sm font-bold placeholder-slate-300 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                        placeholder="Log your experience artifact here..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-indigo-600 transition-all duration-500 shadow-2xl shadow-indigo-600/20 disabled:opacity-50"
                    >
                      {submittingReview ? 'Syncing...' : 'Authorize Submission'}
                    </button>
                  </form>
                </div>
              )}

              {/* Review Entries */}
              <div className="space-y-6">
                {book.reviews && book.reviews.length > 0 ? (
                  book.reviews.map((review) => (
                    <div key={review._id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 group hover:border-indigo-200 transition-all duration-500">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-xl">
                            {review.user?.name?.charAt(0) || 'A'}
                          </div>
                          <div>
                            <p className="font-black text-slate-900 uppercase tracking-tight italic">{review.user?.name || 'Anonymous Subject'}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{new Date(review.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              size={14}
                              className={i < review.rating ? 'text-indigo-600 fill-current' : 'text-slate-100'}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-600 font-medium leading-relaxed italic">
                        "{review.comment}"
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[3rem]">
                    <FiDatabase className="mx-auto text-slate-200 mb-6" size={48} />
                    <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.4em]">No Metadata Records Found</p>
                  </div>
                )}
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;

