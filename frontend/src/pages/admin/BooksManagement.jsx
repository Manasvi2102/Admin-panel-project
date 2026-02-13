import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';
import { FiEdit, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi';

const BooksManagement = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    isbn: '',
    price: '',
    discount: '',
    stock: '',
    description: '',
    coverImage: '',
    publisher: '',
    publishYear: '',
    pages: '',
    language: 'English',
    format: 'Paperback',
    featured: false,
    bestSeller: false,
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchBooks();
    fetchCategories();
  }, [isAdmin]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/books?limit=100');
      setBooks(response.data.data);
    } catch (err) {
      setError('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data);
    } catch (err) {
      console.error(err);
    }
  };



  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        discount: parseFloat(formData.discount) || 0,
        stock: parseInt(formData.stock),
        publishYear: formData.publishYear ? parseInt(formData.publishYear) : undefined,
        pages: formData.pages ? parseInt(formData.pages) : undefined,
      };

      if (editingBook) {
        await api.put(`/books/${editingBook._id}`, data);
        toast.success('Book updated successfully!');
      } else {
        await api.post('/books', data);
        toast.success('Book created successfully!');
      }

      setShowForm(false);
      setEditingBook(null);
      setFormData({
        title: '',
        category: '',
        isbn: '',
        price: '',
        discount: '',
        stock: '',
        description: '',
        coverImage: '',
        publisher: '',
        publishYear: '',
        pages: '',
        language: 'English',
        format: 'Paperback',
        featured: false,
        bestSeller: false,
      });
      fetchBooks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save book');
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      category: book.category._id || book.category,
      isbn: book.isbn,
      price: book.price,
      discount: book.discount || 0,
      stock: book.stock,
      description: book.description,
      coverImage: book.coverImage || '',
      publisher: book.publisher || '',
      publishYear: book.publishYear || '',
      pages: book.pages || '',
      language: book.language || 'English',
      format: book.format || 'Paperback',
      featured: book.featured || false,
      bestSeller: book.bestSeller || false,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await api.delete(`/books/${id}`);
      toast.success('Book deleted successfully!');
      fetchBooks();
    } catch (error) {
      toast.error('Failed to delete book');
    }
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Manage Your Books Library</h2>
          </div>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingBook(null);
              setFormData({
                title: '',
                category: '',
                isbn: '',
                price: '',
                discount: '',
                stock: '',
                description: '',
                coverImage: '',
                publisher: '',
                publishYear: '',
                pages: '',
                language: 'English',
                format: 'Paperback',
                featured: false,
                bestSeller: false,
              });
            }}
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center space-x-2"
          >
            <FiPlus />
            <span>Add New Book</span>
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search books..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
              <h2 className="text-2xl font-bold mb-4">
                {editingBook ? 'Edit Book' : 'Add New Book'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title *</label>
                    <input
                      type="text"
                      name="title"
                      required
                      className="w-full border rounded-md px-3 py-2"
                      value={formData.title}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">ISBN *</label>
                    <input
                      type="text"
                      name="isbn"
                      required
                      className="w-full border rounded-md px-3 py-2"
                      value={formData.isbn}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category *</label>
                  <select
                    name="category"
                    required
                    className="w-full border rounded-md px-3 py-2"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Price *</label>
                    <input
                      type="number"
                      step="0.01"
                      name="price"
                      required
                      className="w-full border rounded-md px-3 py-2"
                      value={formData.price}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Discount (%)</label>
                    <input
                      type="number"
                      name="discount"
                      min="0"
                      max="100"
                      className="w-full border rounded-md px-3 py-2"
                      value={formData.discount}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Stock *</label>
                    <input
                      type="number"
                      name="stock"
                      required
                      min="0"
                      className="w-full border rounded-md px-3 py-2"
                      value={formData.stock}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description *</label>
                  <textarea
                    name="description"
                    required
                    rows="4"
                    className="w-full border rounded-md px-3 py-2"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Cover Image URL</label>
                    <input
                      type="url"
                      name="coverImage"
                      className="w-full border rounded-md px-3 py-2"
                      value={formData.coverImage}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Publisher</label>
                    <input
                      type="text"
                      name="publisher"
                      className="w-full border rounded-md px-3 py-2"
                      value={formData.publisher}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Publish Year</label>
                    <input
                      type="number"
                      name="publishYear"
                      className="w-full border rounded-md px-3 py-2"
                      value={formData.publishYear}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Pages</label>
                    <input
                      type="number"
                      name="pages"
                      className="w-full border rounded-md px-3 py-2"
                      value={formData.pages}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Format</label>
                    <select
                      name="format"
                      className="w-full border rounded-md px-3 py-2"
                      value={formData.format}
                      onChange={handleChange}
                    >
                      <option>Paperback</option>
                      <option>Hardcover</option>
                      <option>E-book</option>
                      <option>Audiobook</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="featured"
                      className="mr-2"
                      checked={formData.featured}
                      onChange={handleChange}
                    />
                    Featured
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="bestSeller"
                      className="mr-2"
                      checked={formData.bestSeller}
                      onChange={handleChange}
                    />
                    Best Seller
                  </label>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingBook(null);
                    }}
                    className="px-4 py-2 border rounded-md hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  >
                    {editingBook ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Books Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cover</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBooks.map((book) => (
                <tr key={book._id}>
                  <td className="px-6 py-4">
                    <img
                      src={book.coverImage || 'https://via.placeholder.com/50?text=Book'}
                      alt={book.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <Link to={`/books/${book._id}`} className="font-medium text-primary-600 hover:underline">
                      {book.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4">{book.author?.name || 'Unknown'}</td>
                  <td className="px-6 py-4">₹{book.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={book.stock < 10 ? 'text-red-600 font-semibold' : ''}>
                      {book.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(book)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(book._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default BooksManagement;

