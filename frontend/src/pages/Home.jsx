import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import BookCard from '../components/BookCard';
import Loading from '../components/Loading';
import { FiArrowRight, FiBook, FiStar, FiTrendingUp, FiSearch, FiX, FiChevronLeft, FiChevronRight, FiUsers, FiAward, FiClock, FiHeart, FiShoppingBag, FiEye, FiMoon, FiSun } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [bookOfTheDay, setBookOfTheDay] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [heroSlide, setHeroSlide] = useState(0);
  const [darkMode, setDarkMode] = useState(() => {
    // Check for saved theme preference or default to light mode
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [stats, setStats] = useState({ books: 0, users: 0, orders: 0 });
  const [readingGoal, setReadingGoal] = useState(12); // books per year
  const [currentProgress, setCurrentProgress] = useState(8);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);

  useEffect(() => {
    fetchHomeData();
  }, []);

  useEffect(() => {
    // Save dark mode preference
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    
    // Apply dark mode to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const [
        featuredRes, 
        bestSellerRes, 
        newArrivalsRes, 
        topRatedRes, 
        trendingRes,
        bookOfDayRes,
        authorsRes,
        categoriesRes,
        statsRes
      ] = await Promise.all([
        api.get('/books?featured=true&limit=4'),
        api.get('/books?bestSeller=true&limit=4'),
        api.get('/books?sort=-createdAt&limit=4'),
        api.get('/books?sort=-ratings.average&limit=4'),
        api.get('/books?trending=true&limit=4'),
        api.get('/books/book-of-the-day'),
        api.get('/authors?limit=6'),
        api.get('/categories'),
        api.get('/books/stats'),
      ]);

      setFeaturedBooks(featuredRes.data?.data || featuredRes.data || []);
      setBestSellers(bestSellerRes.data?.data || bestSellerRes.data || []);
      setNewArrivals(newArrivalsRes.data?.data || newArrivalsRes.data || []);
      setTopRated(topRatedRes.data?.data || topRatedRes.data || []);
      setTrendingBooks(trendingRes.data?.data || trendingRes.data || []);
      setBookOfTheDay(bookOfDayRes.data?.data || bookOfDayRes.data || null);
      setAuthors(authorsRes.data?.data || authorsRes.data || []);
      setCategories(categoriesRes.data?.data || categoriesRes.data || []);
      setStats(statsRes.data || { books: 0, users: 0, orders: 0 });

      // Load recently viewed from localStorage
      if (user) {
        const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        if (viewed.length > 0) {
          try {
            const viewedBooks = await api.get(`/books?ids=${viewed.slice(0, 4).join(',')}`);
            setRecentlyViewed(viewedBooks.data?.data || []);
          } catch (error) {
            console.error('Error fetching recently viewed books:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching home data:', error);
      // Set empty arrays on error to prevent crashes
      setFeaturedBooks([]);
      setBestSellers([]);
      setNewArrivals([]);
      setTopRated([]);
      setTrendingBooks([]);
      setBookOfTheDay(null);
      setAuthors([]);
      setCategories([]);
      setStats({ books: 0, users: 0, orders: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    
    setSubscribing(true);
    try {
      // For now, just show success. In real app, send to backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      alert('Thank you for subscribing! You will receive our latest updates.');
      setNewsletterEmail('');
    } catch (error) {
      alert('Failed to subscribe. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };

  // Hero carousel slides
  const heroSlides = [
    {
      title: "Welcome to BookWorld",
      subtitle: "Discover Your Next Great Read",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=600&fit=crop",
      cta: "Browse Books"
    },
    {
      title: "New Arrivals Every Week",
      subtitle: "Stay updated with the latest releases",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop",
      cta: "View New Books"
    },
    {
      title: "Best Sellers Collection",
      subtitle: "Most loved books by our readers",
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=1200&h=600&fit=crop",
      cta: "Shop Best Sellers"
    }
  ];

  const nextSlide = () => {
    setHeroSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setHeroSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Auto-slide hero carousel
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Enhanced Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 border-2 border-white/20 backdrop-blur-sm"
        title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {darkMode ? <FiSun className="w-6 h-6 animate-spin" /> : <FiMoon className="w-6 h-6 animate-pulse" />}
      </button>
      {/* Enhanced Announcement Banner */}
      <div className={`bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-black py-4 shadow-lg ${darkMode ? 'dark:bg-gradient-to-r dark:from-yellow-600 dark:via-orange-600 dark:to-red-600 dark:text-white' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-4">
            <FiStar className="w-6 h-6 animate-bounce text-yellow-200" />
            <p className="text-sm font-semibold">
              🎉 Free shipping on orders over ₹500! Limited time offer.
            </p>
            <button className="text-xs underline hover:no-underline font-medium transition-colors">
              Learn more →
            </button>
          </div>
        </div>
      </div>

      {/* Quick Access Bar for Logged-in Users */}
      {/* {user && (
        <div className={`py-3 border-b transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Welcome back, <span className="text-primary-600 font-semibold">{user.name}</span>! 👋
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to="/wishlist"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                    darkMode
                      ? 'text-gray-300 hover:text-red-400 hover:bg-gray-700'
                      : 'text-gray-600 hover:text-red-600 hover:bg-gray-100'
                  }`}
                >
                  <FiHeart className="w-5 h-5" />
                  <span className="text-sm font-medium">Wishlist</span>
                </Link>
                <Link
                  to="/cart"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                    darkMode
                      ? 'text-gray-300 hover:text-blue-400 hover:bg-gray-700'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                  }`}
                >
                  <FiShoppingBag className="w-5 h-5" />
                  <span className="text-sm font-medium">Cart</span>
                </Link>
                <Link
                  to="/orders"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                    darkMode
                      ? 'text-gray-300 hover:text-green-400 hover:bg-gray-700'
                      : 'text-gray-600 hover:text-green-600 hover:bg-gray-100'
                  }`}
                >
                  <FiEye className="w-5 h-5" />
                  <span className="text-sm font-medium">Orders</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )} */}

      {/* Hero Carousel */}
      <section className="relative h-screen overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === heroSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black/50"></div>
            </div>
            <div className="relative h-full flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-gray-200">
                  {slide.subtitle}
                </p>
                
                {/* Search Bar */}
                <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search for books, authors, genres..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 text-gray-900 rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 shadow-xl text-lg"
                    />
                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                  </div>
                </form>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/books"
                    className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    {slide.cta} <FiArrowRight className="ml-2" />
                  </Link>
                  <Link
                    to="/books?featured=true"
                    className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition shadow-lg hover:shadow-xl"
                  >
                    Featured Books
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Carousel Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200"
        >
          <FiChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200"
        >
          <FiChevronRight className="w-6 h-6 text-white" />
        </button>
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setHeroSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === heroSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className={`py-16 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`} style={{ backgroundImage: darkMode ? 'url(/patterns/dark-pattern.svg)' : 'url(/patterns/light-pattern.svg)', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: 'cover', color: darkMode ? 'white' : 'black' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center animate-slide-in-left">
              <FiBook className="w-12 h-12 mx-auto mb-4 text-primary-600" />
              <h3 className="text-3xl font-bold  mb-2" data-count={stats.books} style={{color: darkMode ? "white" : "black"}}>
                {stats.books.toLocaleString()}+
              </h3>
              <p className="" style={{color: darkMode ? "white" :"gray" }}>Books Available</p>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <FiUsers className="w-12 h-12 mx-auto mb-4 text-primary-600" />
              <h3 className="text-3xl font-bold mb-2" data-count={stats.users} style={{color: darkMode ? "white" : "black"}}>
                {stats.users.toLocaleString()}+
              </h3>
              <p className="" style={{color: darkMode ? "white" :"gray" }}>Happy Readers</p>
            </div>
            <div className="text-center animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
              <FiShoppingBag className="w-12 h-12 mx-auto mb-4 text-primary-600" />
              <h3 className="text-3xl font-bold" data-count={stats.orders} style={{color: darkMode ? "white" : "black"}}>
                {stats.orders.toLocaleString()}+
              </h3>
              <p className="" style={{color: darkMode ? "white" :"gray" }}>Orders Delivered</p>
            </div>
            <div className="text-center animate-bounce" style={{ animationDelay: '0.6s' }}>
              <FiAward className="w-12 h-12 mx-auto mb-4 text-primary-600" />
              <h3 className="text-3xl font-bold mb-2">4.8/5</h3>
              <p className="" style={{color: darkMode ? "white" :"gray" }}>Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reading Goals Section */}
      {user && (
        <section className={`py-16 ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-r from-purple-50 to-indigo-50'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Your Reading Journey</h2>
              <p className={`text-lg ${darkMode ? 'text-purple-200' : 'text-purple-600'}`}>
                Track your progress and achieve your reading goals!
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Reading Progress */}
              <div className={`rounded-2xl shadow-xl p-8 text-center ${darkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white'}`}>
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke={darkMode ? "#4B5563" : "#E5E7EB"}
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="#8B5CF6"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 50}`}
                      strokeDashoffset={`${2 * Math.PI * 50 * (1 - currentProgress / readingGoal)}`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div>
                      <div className="text-3xl font-bold text-purple-600">{currentProgress}</div>
                      <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>of {readingGoal}</div>
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">2024 Reading Goal</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {readingGoal - currentProgress} more books to reach your goal!
                </p>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${(currentProgress / readingGoal) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className={`rounded-2xl shadow-xl p-8 ${darkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white'}`}>
                <h3 className="text-xl font-bold mb-6 text-center">This Month</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <FiBook className="w-5 h-5 mr-2 text-blue-500" />
                      Books Read
                    </span>
                    <span className="font-bold text-blue-600">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <FiClock className="w-5 h-5 mr-2 text-green-500" />
                      Reading Time
                    </span>
                    <span className="font-bold text-green-600">24h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <FiStar className="w-5 h-5 mr-2 text-yellow-500" />
                      Reviews Given
                    </span>
                    <span className="font-bold text-yellow-600">2</span>
                  </div>
                </div>
              </div>

              {/* Reading Challenges */}
              <div className={`rounded-2xl shadow-xl p-8 ${darkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white'}`}>
                <h3 className="text-xl font-bold mb-6 text-center">Active Challenges</h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200">Genre Explorer</h4>
                    <p className="text-sm text-blue-600 dark:text-blue-300">Read 5 different genres</p>
                    <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full w-3/5"></div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30">
                    <h4 className="font-semibold text-green-800 dark:text-green-200">Speed Reader</h4>
                    <p className="text-sm text-green-600 dark:text-green-300">Finish 2 books this month</p>
                    <div className="mt-2 w-full bg-green-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full w-4/5"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Enhanced Categories Section */}
      <section className={`py-16 ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl font-bold text-center mb-12 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Browse by Category
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.slice(0, 10).map((category, index) => (
              <Link
                key={category._id}
                to={`/books?category=${category.slug}`}
                className={`${
                  darkMode
                    ? 'bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white border-gray-600'
                    : 'bg-gradient-to-br from-white via-blue-50 to-indigo-50 hover:from-blue-100 hover:via-indigo-100 hover:to-purple-100 text-gray-800 border-blue-200 shadow-xl hover:shadow-2xl'
                } w-32 p-4 rounded-xl transition-all duration-300 text-center group transform hover:scale-105 hover:-translate-y-1 border-2 relative overflow-hidden`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Background Pattern */}
                <div className={`absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500 ${
                  darkMode ? 'bg-gradient-to-br from-blue-400 to-purple-600' : 'bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600'
                }`}></div>

                {/* Icon Container */}
                <div className={`w-12 h-12 mx-auto mb-2 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  darkMode
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                    : 'bg-gradient-to-br from-blue-500 to-purple-600'
                } group-hover:scale-110 group-hover:rotate-6 shadow-lg`}>
                  <FiBook className="w-6 h-6 text-white drop-shadow-lg" />
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="font-bold text-sm mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 leading-tight">
                    {category.name}
                  </h3>
                  <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {category.bookCount || Math.floor(Math.random() * 50) + 10}
                  </p>
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-400/50 transition-all duration-500"></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Book of the Day */}
      {bookOfTheDay && (
        <section className={`py-16 ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-r from-purple-50 to-pink-50'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center mb-8">
              <FiAward className="w-8 h-8 text-yellow-500 mr-3" />
              <h2 className="text-4xl font-bold text-center">Book of the Day</h2>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className={`rounded-2xl shadow-2xl overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img
                      src={bookOfTheDay.coverImage || 'https://via.placeholder.com/400x600?text=Book+Cover'}
                      alt={bookOfTheDay.title}
                      className="w-full h-96 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-2/3 p-8">
                    <div className="flex items-center mb-4">
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                        Today's Special
                      </span>
                    </div>
                    <h3 className="text-3xl font-bold mb-4">{bookOfTheDay.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
                      by {bookOfTheDay.author?.name || 'Unknown Author'}
                    </p>
                    <p className="text-gray-700 dark:text-gray-200 mb-6 line-clamp-3">
                      {bookOfTheDay.description || 'No description available.'}
                    </p>
                    <div className="flex items-center mb-6">
                      <div className="flex items-center space-x-1 mr-4">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(bookOfTheDay.ratings?.average || 0)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-500">
                        ({bookOfTheDay.ratings?.count || 0} reviews)
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <span className="text-4xl font-bold text-primary-600">
                          ₹{bookOfTheDay.price?.toFixed(2)}
                        </span>
                        {bookOfTheDay.discount > 0 && (
                          <span className="text-xl text-gray-500 line-through">
                            ₹{(bookOfTheDay.price * (1 + bookOfTheDay.discount / 100)).toFixed(2)}
                          </span>
                        )}
                      </div>
                      <Link
                        to={`/books/${bookOfTheDay._id}`}
                        className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition inline-flex items-center"
                      >
                        View Details <FiArrowRight className="ml-2" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Books */}
      <section className={`py-16 ${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-2xl ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} shadow-lg`}>
                <FiStar className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Featured Books</h2>
                <p className={`text-lg mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Handpicked selections for you</p>
              </div>
            </div>
            <Link
              to="/books?featured=true"
              className={`group px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                darkMode
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                  : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
              } transform hover:scale-105`}
            >
              <span>View All</span>
              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {featuredBooks.map((book, index) => (
              <div
                key={book._id}
                className="transform hover:scale-105 transition-all duration-500"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <BookCard book={book} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className={`py-16 ${darkMode ? 'bg-gradient-to-br from-gray-900 to-black' : 'bg-gradient-to-br from-white to-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-2xl ${darkMode ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-gradient-to-r from-yellow-400 to-orange-500'} shadow-lg`}>
                <FiTrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Best Sellers</h2>
                <p className={`text-lg mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Most loved by our readers</p>
              </div>
            </div>
            <Link
              to="/books?bestSeller=true"
              className={`group px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                darkMode
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white shadow-lg hover:shadow-xl'
              } transform hover:scale-105`}
            >
              <span>View All</span>
              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {bestSellers.map((book, index) => (
              <div
                key={book._id}
                className="transform hover:scale-105 transition-all duration-500"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <BookCard book={book} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Rated */}
      <section className={`py-16 ${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-yellow-50 to-orange-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-2xl ${darkMode ? 'bg-gradient-to-r from-yellow-500 to-amber-500' : 'bg-gradient-to-r from-yellow-400 to-amber-500'} shadow-lg`}>
                <FiStar className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Top Rated</h2>
                <p className={`text-lg mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Highest rated by our community</p>
              </div>
            </div>
            <Link
              to="/books?sort=-ratings.average"
              className={`group px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                darkMode
                  ? 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white shadow-lg hover:shadow-xl'
              } transform hover:scale-105`}
            >
              <span>View All</span>
              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {topRated.map((book, index) => (
              <div
                key={book._id}
                className="transform hover:scale-105 transition-all duration-500"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <BookCard book={book} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Books */}
      <section className={`py-16 ${darkMode ? 'bg-gradient-to-br from-gray-900 to-red-900/20' : 'bg-gradient-to-br from-red-50 to-pink-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-2xl ${darkMode ? 'bg-gradient-to-r from-red-500 to-pink-500' : 'bg-gradient-to-r from-red-400 to-pink-500'} shadow-lg`}>
                <FiTrendingUp className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div>
                <h2 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Trending Now</h2>
                <p className={`text-lg mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>What's hot in the book world</p>
              </div>
            </div>
            <Link
              to="/books?trending=true"
              className={`group px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                darkMode
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 text-white shadow-lg hover:shadow-xl'
              } transform hover:scale-105`}
            >
              <span>View All</span>
              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {trendingBooks.map((book, index) => (
              <div
                key={`trending-${book._id}`}
                className="transform hover:scale-105 transition-all duration-500"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <BookCard book={book} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Personalized Recommendations for Logged-in Users */}
      {user && (
        <section className={`py-16 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-2">
                <FiBook className="w-6 h-6 text-purple-600" />
                <h2 className="text-3xl font-bold">Recommended for You</h2>
              </div>
              <Link
                to="/books"
                className="text-purple-600 hover:text-purple-700 font-semibold flex items-center"
              >
                View All <FiArrowRight className="ml-2" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {featuredBooks.slice(0, 4).map((book) => (
                <BookCard key={`rec-${book._id}`} book={book} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recently Viewed (for logged-in users) */}
      {user && recentlyViewed.length > 0 && (
        <section className={`py-16 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-2">
                <FiClock className="w-6 h-6 text-blue-600" />
                <h2 className="text-3xl font-bold">Recently Viewed</h2>
              </div>
              <Link
                to="/books"
                className="text-blue-600 hover:text-blue-700 font-semibold flex items-center"
              >
                Browse More <FiArrowRight className="ml-2" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {recentlyViewed.map((book) => (
                <BookCard key={`recent-${book._id}`} book={book} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      <section className={`py-16 ${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-green-50 to-emerald-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-2xl ${darkMode ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-green-400 to-emerald-500'} shadow-lg`}>
                <FiBook className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>New Arrivals</h2>
                <p className={`text-lg mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Fresh books just added to our collection</p>
              </div>
            </div>
            <Link
              to="/books?sort=-createdAt"
              className={`group px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                darkMode
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl'
              } transform hover:scale-105`}
            >
              <span>View All</span>
              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {newArrivals.map((book, index) => (
              <div
                key={book._id}
                className="transform hover:scale-105 transition-all duration-500"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <BookCard book={book} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Author Spotlight */}
      {authors.length > 0 && (
        <section className={`py-16 ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-r from-green-50 to-blue-50'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center mb-12">
              <FiUsers className="w-8 h-8 text-green-600 mr-3" />
              <h2 className="text-4xl font-bold text-center">Author Spotlight</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {authors.slice(0, 6).map((author) => (
                <div key={author._id} className={`rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                  <div className="p-6 text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {author.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{author.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {author.bio || 'Renowned author with multiple bestsellers.'}
                    </p>
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary-600">{author.bookCount || 0}</div>
                        <div className="text-sm text-gray-500">Books</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-500">{author.averageRating?.toFixed(1) || '0.0'}</div>
                        <div className="text-sm text-gray-500">Rating</div>
                      </div>
                    </div>
                    <Link
                      to={`/authors/${author._id}`}
                      className="inline-block bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition"
                    >
                      View Books
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Enhanced Testimonials */}
      <section className={`py-16 ${darkMode ? 'bg-gray-900' : 'bg-primary-600'} text-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                rating: 5,
                comment: 'Amazing selection of books and great customer service!',
                image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
                location: 'New York, USA'
              },
              {
                name: 'Michael Chen',
                rating: 5,
                comment: 'Fast delivery and excellent quality. Highly recommended!',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
                location: 'San Francisco, USA'
              },
              {
                name: 'Emily Davis',
                rating: 5,
                comment: 'Love the easy browsing and checkout process.',
                image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
                location: 'London, UK'
              },
            ].map((testimonial, idx) => (
              <div key={idx} className={`rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ${darkMode ? 'bg-gray-800' : 'bg-white/10 backdrop-blur-sm'}`}>
                <div className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white/20">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`w-5 h-5 ${
                          i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-primary-100'}`}>{testimonial.comment}</p>
                  <p className="font-semibold text-lg">- {testimonial.name}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-primary-200'}`}>{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Book Quotes Carousel */}
      <section className={`py-16 ${darkMode ? 'bg-gradient-to-r from-gray-900 to-gray-800' : 'bg-gradient-to-r from-amber-50 to-orange-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <FiStar className="w-12 h-12 mx-auto mb-4 text-amber-600" />
            <h2 className="text-4xl font-bold mb-4">Inspiring Book Quotes</h2>
            <p className={`text-lg ${darkMode ? 'text-amber-200' : 'text-amber-700'}`}>
              Words that inspire and transform
            </p>
          </div>
          <div className="relative overflow-hidden">
            <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${0 * 100}%)` }}>
              {[
                {
                  quote: "A reader lives a thousand lives before he dies. The man who never reads lives only one.",
                  author: "George R.R. Martin",
                  book: "A Dance with Dragons",
                  image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop"
                },
                {
                  quote: "Books are a uniquely portable magic.",
                  author: "Stephen King",
                  book: "On Writing",
                  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop"
                },
                {
                  quote: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
                  author: "Dr. Seuss",
                  book: "I Can Read With My Eyes Shut!",
                  image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop"
                }
              ].map((quote, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <div className={`max-w-4xl mx-auto rounded-2xl shadow-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="md:flex">
                      <div className="md:w-1/2">
                        <img
                          src={quote.image}
                          alt="Book Quote"
                          className="w-full h-64 md:h-full object-cover"
                        />
                      </div>
                      <div className="md:w-1/2 p-8 flex items-center">
                        <div>
                          <div className="text-6xl text-amber-400 mb-4">"</div>
                          <blockquote className={`text-xl md:text-2xl font-medium mb-6 leading-relaxed ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {quote.quote}
                          </blockquote>
                          <div className="border-l-4 border-amber-400 pl-6">
                            <cite className={`font-semibold text-lg ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                              — {quote.author}
                            </cite>
                            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {quote.book}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reading Goals & Challenges */}
      <section className={`py-16 ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-r from-indigo-50 to-purple-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <FiHeart className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
            <h2 className="text-4xl font-bold mb-4">Reading Goals & Challenges</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join our community challenges and set your reading goals to become a better reader
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`rounded-xl shadow-lg p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                <FiBook className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Monthly Reading Challenge</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Read 4 books this month and earn exclusive badges and discounts
              </p>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full" style={{width: '60%'}}></div>
                </div>
                <span className="text-sm font-semibold text-indigo-600">2/4</span>
              </div>
              <button className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-600 transition">
                Join Challenge
              </button>
            </div>

            <div className={`rounded-xl shadow-lg p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
                <FiTrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Genre Explorer</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Discover new genres and expand your reading horizons
              </p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Fiction ✓</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Mystery</span>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Romance</span>
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">Sci-Fi</span>
              </div>
              <button className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-teal-600 transition">
                Explore Genres
              </button>
            </div>

            <div className={`rounded-xl shadow-lg p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <FiUsers className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Reading Community</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Connect with fellow book lovers and share your thoughts
              </p>
              <div className="flex items-center justify-center space-x-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">2,847</div>
                  <div className="text-sm text-gray-500">Members</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600">156</div>
                  <div className="text-sm text-gray-500">Discussions</div>
                </div>
              </div>
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition">
                Join Community
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className={`py-16 ${darkMode ? 'bg-gray-900' : 'bg-gray-900'} text-white`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-gray-400 mb-8">
            Get the latest book recommendations and exclusive offers delivered to your inbox
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
            <button 
              type="submit"
              disabled={subscribing}
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {subscribing ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;

