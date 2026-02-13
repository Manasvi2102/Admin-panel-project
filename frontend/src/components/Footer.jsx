import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">📚 BookWorld</h3>
            <p className="text-gray-400">
              Your one-stop destination for books. Discover, read, and enjoy the world of literature.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/books" className="text-gray-400 hover:text-white transition">
                  Books
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/books?category=fiction" className="text-gray-400 hover:text-white transition">
                  Fiction
                </Link>
              </li>
              <li>
                <Link to="/books?category=non-fiction" className="text-gray-400 hover:text-white transition">
                  Non-Fiction
                </Link>
              </li>
              <li>
                <Link to="/books?category=science-fiction" className="text-gray-400 hover:text-white transition">
                  Science Fiction
                </Link>
              </li>
              <li>
                <Link to="/books?category=mystery-thriller" className="text-gray-400 hover:text-white transition">
                  Mystery & Thriller
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: info@BookWorld.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Book Street, Reading City</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} BookWorld. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

