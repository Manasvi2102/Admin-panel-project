import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import BookCard from '../components/BookCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { FiSearch, FiFilter, FiX, FiGrid, FiList, FiMoon, FiSun, FiSliders, FiBookOpen, FiHeart, FiStar, FiTrendingUp } from 'react-icons/fi';

const Books = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [darkMode, setDarkMode] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [stats, setStats] = useState({ totalBooks: 0, totalCategories: 0, averageRating: 0 });
  
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minRating: searchParams.get('minRating') || '',
    author: searchParams.get('author') || '',
    language: searchParams.get('language') || '',
    sort: searchParams.get('sort') || '-createdAt',
  });

  const [showFilters, setShowFilters] = useState(false);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v)),
      });

      const response = await api.get(`/books?${params}`);
      setBooks(response.data.data);
      setTotalPages(response.data.pages);
    } catch (err) {
      setError('Failed to fetch books');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data);
      setStats(prev => ({ ...prev, totalCategories: response.data.data.length }));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/books/stats');
      setStats(prev => ({
        ...prev,
        totalBooks: response.data.data.books,
        averageRating: 4.2 // This would come from backend
      }));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchCategories();
    fetchStats();
  }, [currentPage, filters]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const toggleFavorite = (bookId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(bookId)) {
        newFavorites.delete(bookId);
      } else {
        newFavorites.add(bookId);
      }
      return newFavorites;
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setCurrentPage(1);
    const newParams = new URLSearchParams({
      ...filters,
      [key]: value,
    });
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      author: '',
      language: '',
      sort: '-createdAt',
    };
    setFilters(clearedFilters);
    setCurrentPage(1);
    setSearchParams({});
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-200`}>
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200"
      >
        {darkMode ? <FiSun className="w-5 h-5 text-yellow-400" /> : <FiMoon className="w-5 h-5 text-gray-600" />}
      </button>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Stats */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Browse Books</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Discover your next favorite book from our collection of {stats.totalBooks.toLocaleString()} books
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                >
                  <FiGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                >
                  <FiList className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <div className="flex items-center">
                <FiBookOpen className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalBooks.toLocaleString()}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Books</p>
                </div>
              </div>
            </div>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <div className="flex items-center">
                <FiTrendingUp className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalCategories}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Categories</p>
                </div>
              </div>
            </div>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <div className="flex items-center">
                <FiStar className="w-8 h-8 text-yellow-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{stats.averageRating}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</p>
                </div>
              </div>
            </div>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <div className="flex items-center">
                <FiHeart className="w-8 h-8 text-red-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{favorites.size}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Favorites</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input           type="text"
                placeholder="Search books by title, author, or ISBN..."
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                  darkMode ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'
                }`}
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-3 border rounded-lg hover:shadow-md transition-all ${
                  darkMode ? 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700' : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
              >
                <FiFilter className="w-4 h-4" />
                <span>Filters</span>
              </button>
              {/* <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`flex items-center space-x-2 px-4 py-3 border rounded-lg hover:shadow-md transition-all ${
                  darkMode ? 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700' : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
              >
                <FiSliders className="w-4 h-4" />
                <span>Advanced</span>
              </button> */}
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className={`p-6 rounded-xl shadow-lg mb-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Basic Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  Clear All
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Category
                  </label>
                  <select
                    className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Min Price
                  </label>
                  <input
                    type="number"
                    className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                    placeholder="0"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Max Price
                  </label>
                  <input
                    type="number"
                    className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                    placeholder="1000"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Sort By
                  </label>
                  <select
                    className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                    value={filters.sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                  >
                    <option value="-createdAt">Newest First</option>
                    <option value="createdAt">Oldest First</option>
                    <option value="-ratings.average">Highest Rated</option>
                    <option value="price">Price: Low to High</option>
                    <option value="-price">Price: High to Low</option>
                    <option value="title">Title: A to Z</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Advanced Filters Panel
          {showAdvancedFilters && (
            <div className={`p-6 rounded-xl shadow-lg mb-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Advanced Filters</h3>
                <button
                  onClick={() => setShowAdvancedFilters(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Author
                  </label>
                  <input
                    type="text"
                    className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                    placeholder="Search by author name"
                    value={filters.author}
                    onChange={(e) => handleFilterChange('author', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Language
                  </label>
                  <select
                    className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                    value={filters.language}
                    onChange={(e) => handleFilterChange('language', e.target.value)}
                  >
                    <option value="">All Languages</option>
                    <option value="english">English</option>
                    <option value="spanish">Spanish</option>
                    <option value="french">French</option>
                    <option value="german">German</option>
                    <option value="hindi">Hindi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Min Rating
                  </label>
                  <select
                    className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                    value={filters.minRating}
                    onChange={(e) => handleFilterChange('minRating', e.target.value)}
                  >
                    <option value="">Any Rating</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="4">4+ Stars</option>
                    <option value="3.5">3.5+ Stars</option>
                    <option value="3">3+ Stars</option>
                  </select>
                </div>
              </div>
            </div>
          )}
 */}
          {/* Active Filters */}
          {(filters.category || filters.minPrice || filters.maxPrice || filters.minRating || filters.author || filters.language) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {filters.category && (
                <span className={`px-3 py-1 rounded-full text-sm flex items-center ${darkMode ? 'bg-primary-900 text-primary-100' : 'bg-primary-100 text-primary-800'}`}>
                  Category: {categories.find(c => c.slug === filters.category)?.name}
                  <button
                    onClick={() => handleFilterChange('category', '')}
                    className="ml-2 hover:text-primary-900 dark:hover:text-primary-200"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.author && (
                <span className={`px-3 py-1 rounded-full text-sm flex items-center ${darkMode ? 'bg-green-900 text-green-100' : 'bg-green-100 text-green-800'}`}>
                  Author: {filters.author}
                  <button
                    onClick={() => handleFilterChange('author', '')}
                    className="ml-2 hover:text-green-900 dark:hover:text-green-200"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.language && (
                <span className={`px-3 py-1 rounded-full text-sm flex items-center ${darkMode ? 'bg-purple-900 text-purple-100' : 'bg-purple-100 text-purple-800'}`}>
                  Language: {filters.language}
                  <button
                    onClick={() => handleFilterChange('language', '')}
                    className="ml-2 hover:text-purple-900 dark:hover:text-purple-200"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.minPrice && (
                <span className={`px-3 py-1 rounded-full text-sm flex items-center ${darkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-800'}`}>
                  Min: ₹{filters.minPrice}
                  <button
                    onClick={() => handleFilterChange('minPrice', '')}
                    className="ml-2 hover:text-blue-900 dark:hover:text-blue-200"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.maxPrice && (
                <span className={`px-3 py-1 rounded-full text-sm flex items-center ${darkMode ? 'bg-red-900 text-red-100' : 'bg-red-100 text-red-800'}`}>
                  Max: ₹{filters.maxPrice}
                  <button
                    onClick={() => handleFilterChange('maxPrice', '')}
                    className="ml-2 hover:text-red-900 dark:hover:text-red-200"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.minRating && (
                <span className={`px-3 py-1 rounded-full text-sm flex items-center ${darkMode ? 'bg-yellow-900 text-yellow-100' : 'bg-yellow-100 text-yellow-800'}`}>
                  Rating: {filters.minRating}+ stars
                  <button
                    onClick={() => handleFilterChange('minRating', '')}
                    className="ml-2 hover:text-yellow-900 dark:hover:text-yellow-200"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {error && <ErrorMessage message={error} />}

        {loading ? (
          <div className="flex justify-center py-12">
            <Loading size="lg" />
          </div>
        ) : books.length === 0 ? (
          <div className={`text-center py-12 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg`}>
            <FiBookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No books found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Try adjusting your search or filter criteria.</p>
            <button
              onClick={clearFilters}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {/* Books Display */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {books.map((book) => (
                  <BookCard key={book._id} book={book} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {books.map((book) => (
                  <div key={book._id} className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} hover:shadow-xl transition-shadow duration-200`}>
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-48 flex-shrink-0">
                        <img
                          src={book.coverImage || 'https://via.placeholder.com/200x300?text=Book+Cover'}
                          alt={book.title}
                          className="w-full h-64 md:h-72 object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{book.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-2">by {book.author?.name || 'Unknown Author'}</p>
                            <div className="flex items-center mb-3">
                              <div className="flex items-center space-x-1 mr-4">
                                {[...Array(5)].map((_, i) => (
                                  <FiStar
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < Math.floor(book.ratings?.average || 0)
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                ({book.ratings?.count || 0} reviews)
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => toggleFavorite(book._id)}
                            className={`p-3 rounded-full shadow-lg transition-all duration-200 ${
                              favorites.has(book._id)
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-red-500'
                            }`}
                          >
                            <FiHeart className={`w-5 h-5 ${favorites.has(book._id) ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
                          {book.description || 'No description available.'}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <span className="text-2xl font-bold text-primary-600">₹{book.price?.toFixed(2)}</span>
                            {book.discount > 0 && (
                              <span className="text-lg text-gray-500 line-through">
                                ₹{(book.price * (1 + book.discount / 100)).toFixed(2)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              book.stock > 10
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : book.stock > 0
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>
                              {book.stock > 10 ? 'In Stock' : book.stock > 0 ? `${book.stock} left` : 'Out of Stock'}
                            </span>
                            <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-8">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 border rounded-lg transition-colors ${
                    darkMode
                      ? 'border-gray-600 bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700'
                      : 'border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 rounded-lg transition-colors ${
                          currentPage === pageNum
                            ? 'bg-primary-600 text-white'
                            : darkMode
                            ? 'bg-gray-800 text-white hover:bg-gray-700'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 border rounded-lg transition-colors ${
                    darkMode
                      ? 'border-gray-600 bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700'
                      : 'border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Books;

