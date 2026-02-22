import { Link } from 'react-router-dom';
import { FiShoppingCart, FiEye, FiStar, FiHeart, FiTrendingUp, FiTarget } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import toast from 'react-hot-toast';

const BookCard = ({ book }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Identity required.');
      return;
    }
    try {
      await addToCart(book._id, 1);
      toast.success('Allocated to cart.');
    } catch (error) {
      toast.error('Access denied.');
    }
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return toast.error('Login required.');
    try {
      if (isInWishlist(book._id)) {
        await removeFromWishlist(book._id);
        toast.success('Removed from archive.');
      } else {
        await addToWishlist(book._id);
        toast.success('Saved to vault.');
      }
    } catch (err) {
      toast.error('Operation failed.');
    }
  };

  return (
    <div className="group relative bg-white rounded-[2.5rem] border border-slate-100 p-2 transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] hover:-translate-y-3">

      {/* Visual Container */}
      <Link to={`/books/${book._id}`} className="block relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-slate-100">
        <img
          src={book.coverImage || 'https://images.unsplash.com/photo-1543004218-ee141104e14f?auto=format&fit=crop&q=80&w=800'}
          alt={book.title}
          className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-2 group-hover:brightness-50"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800';
          }}
        />

        {/* Abstract Identity Overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-t from-slate-900 via-transparent to-transparent flex flex-col justify-end p-8">
          <div className="flex items-center gap-3 transform translate-y-10 group-hover:translate-y-0 transition-transform duration-700">
            <div className="w-10 h-0.5 bg-indigo-500"></div>
            <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">View Artifact</span>
          </div>
        </div>

        {/* Floating System Badges */}
        <div className="absolute top-5 left-5 flex flex-col gap-2">
          {book.discount > 0 && (
            <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></span>
              <span className="text-[9px] font-black text-slate-900 tracking-widest">-{book.discount}% SKU OFF</span>
            </div>
          )}
          {book.bestSeller && (
            <div className="bg-indigo-600 px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2">
              <FiTrendingUp className="text-white w-3 h-3" />
              <span className="text-[9px] font-black text-white tracking-[0.2em] uppercase">High Yield</span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        {!isAdmin && (
          <div className="absolute top-5 right-5 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
            <button onClick={handleWishlistToggle} className={`w-12 h-12 rounded-xl shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${isInWishlist(book._id) ? 'bg-rose-500 text-white' : 'bg-white/90 backdrop-blur-md text-slate-900 hover:text-rose-500'}`}>
              <FiHeart className={isInWishlist(book._id) ? 'fill-current' : ''} size={18} />
            </button>
            <button onClick={handleAddToCart} className="w-12 h-12 bg-white/90 backdrop-blur-md text-slate-900 rounded-xl shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:text-indigo-600">
              <FiShoppingCart size={18} />
            </button>
          </div>
        )}
      </Link>

      {/* Discovery Area */}
      <div className="p-6 space-y-4">
        <div className="space-y-1">
          <Link to={`/books/${book._id}`}>
            <h3 className="text-base font-black text-slate-900 line-clamp-1 italic uppercase tracking-tight group-hover:text-indigo-600 transition-colors">
              {book.title}
            </h3>
          </Link>
          <div className="flex items-center gap-2">
            <FiTarget className="text-slate-200" size={10} />
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate">
              Ref: {book.author?.name || 'External Core'}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-slate-900 tracking-tighter">₹{book.price.toLocaleString()}</span>
            {book.discount > 0 && (
              <span className="text-[10px] text-slate-300 line-through font-bold">EST. ₹{(book.price * (1 + book.discount / 100)).toFixed(0)}</span>
            )}
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
            <FiStar className="text-amber-400 fill-current" size={12} />
            <span className="text-[10px] font-black text-slate-500">{book.ratings?.average || 4.2}</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default BookCard;
