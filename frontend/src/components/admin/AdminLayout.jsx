import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FiLayout, 
  FiBook, 
  FiUsers, 
  FiShoppingBag, 
  FiLogOut,
  FiHome,
  FiChevronDown,
  FiShoppingCart
} from 'react-icons/fi';
import { useState } from 'react';

const AdminLayout = ({ children }) => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: FiLayout },
    { path: '/admin/books', label: 'Books Management', icon: FiBook },
    { path: '/admin/orders', label: 'Orders', icon: FiShoppingBag },
    { path: '/admin/users', label: 'Users', icon: FiUsers },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 shadow-2xl fixed h-screen overflow-y-auto">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-700">
            <Link to="/admin/dashboard" className="flex items-center space-x-3 group">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2.5 rounded-lg group-hover:shadow-lg transition-all">
                <FiLayout className="text-white w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-bold text-white block">Admin</span>
                <span className="text-xs text-gray-400">Panel</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                  {isActive && <span className="ml-auto w-2 h-2 bg-white rounded-full"></span>}
                </Link>
              );
            })}
          </nav>

          {/* User Info & Actions */}
          <div className="p-4 border-t border-gray-700 space-y-3">
            <div className="px-4 py-3 bg-gray-700 rounded-lg">
              <p className="font-semibold text-white text-sm">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              <span className="inline-block mt-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                🔐 Admin
              </span>
            </div>
            <Link
              to="/"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 font-medium"
            >
              <FiHome className="w-5 h-5" />
              <span>Store</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-red-400 hover:bg-red-600/20 hover:text-red-300 transition-all duration-200 font-medium"
            >
              <FiLogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {menuItems.find(item => item.path === location.pathname)?.label || 'Admin Panel'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">Welcome back, {user?.name}!</p>
            </div>
            <div className="text-sm text-gray-600">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

