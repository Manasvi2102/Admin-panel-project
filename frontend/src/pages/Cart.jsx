import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Loading from '../components/Loading';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Cart = () => {
  const { isAuthenticated } = useAuth();
  const { cart, loading, updateCartItem, removeFromCart, fetchCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchCart();
  }, [isAuthenticated]);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(itemId, newQuantity);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update cart');
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromCart(itemId);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FiShoppingBag className="w-24 h-24 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Start adding some books to your cart!</p>
          <Link
            to="/books"
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition"
          >
            Browse Books
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 5;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => {
              const book = item.book;
              const price = book.discount > 0 
                ? book.price * (1 - book.discount / 100) 
                : book.price;
              const itemTotal = price * item.quantity;

              return (
                <div key={item._id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <img
                      src={book.coverImage || 'https://via.placeholder.com/150?text=Book'}
                      alt={book.title}
                      className="w-32 h-40 object-cover rounded"
                    />
                    <div className="flex-1">
                      <Link to={`/books/${book._id}`}>
                        <h3 className="text-xl font-semibold hover:text-primary-600 transition mb-2">
                          {book.title}
                        </h3>
                      </Link>
                      <p className="text-gray-600 mb-2">by {book.author?.name || 'Unknown'}</p>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          {book.discount > 0 ? (
                            <div>
                              <span className="text-lg font-bold text-primary-600">
                                ₹{price.toFixed(2)}
                              </span>
                              <span className="text-sm text-gray-500 line-through ml-2">
                                ₹{book.price.toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-lg font-bold text-primary-600">
                              ₹{book.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Stock: {book.stock}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-1 border rounded disabled:opacity-50"
                          >
                            <FiMinus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                            disabled={item.quantity >= book.stock}
                            className="p-1 border rounded disabled:opacity-50"
                          >
                            <FiPlus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-lg font-bold">
                            ${itemTotal.toFixed(2)}
                          </span>
                          <button
                            onClick={() => handleRemoveItem(item._id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                {subtotal < 50 && (
                  <p className="text-sm text-primary-600">
                    Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                  </p>
                )}
              </div>
              <div className="border-t pt-4 mb-4">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <Link
                to="/checkout"
                className="block w-full bg-primary-600 text-white text-center py-3 rounded-md hover:bg-primary-700 transition"
              >
                Proceed to Checkout
              </Link>
              <Link
                to="/books"
                className="block w-full text-center py-3 text-gray-700 hover:text-gray-900 mt-2"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

