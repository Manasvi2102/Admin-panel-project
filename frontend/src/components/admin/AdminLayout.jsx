import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiLayout,
  FiBook,
  FiUsers,
  FiShoppingBag,
  FiLogOut,
  FiHome,
  FiChevronLeft,
  FiChevronRight,
  FiShoppingCart,
  FiSettings,
  FiBell
} from 'react-icons/fi';
import { useState } from 'react';

const AdminLayout = ({ children }) => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: FiLayout },
    { path: '/admin/books', label: 'Books', icon: FiBook },
    { path: '/admin/orders', label: 'Orders', icon: FiShoppingBag },
    { path: '/admin/users', label: 'Users', icon: FiUsers },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-outfit">
      {/* Sidebar */}
      <aside
        className={`${isCollapsed ? 'w-20' : 'w-72'
          } bg-[#0f172a] text-slate-300 transition-all duration-300 ease-in-out fixed h-screen z-50 shadow-2xl overflow-hidden flex flex-col`}
      >
        {/* Logo Area */}
        <div className="h-20 flex items-center px-6 border-b border-slate-800/50">
          <Link to="/admin/dashboard" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-tr from-indigo-500 to-violet-600 p-2 rounded-xl shadow-lg ring-4 ring-indigo-500/10 group-hover:scale-110 transition-transform">
              <FiBook className="text-white w-6 h-6" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-xl font-black text-white leading-tight tracking-tight">BookNest</span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-indigo-400">Admin Control</span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center group relative px-4 py-3.5 rounded-xl transition-all duration-300 ${isActive
                  ? 'bg-gradient-to-r from-indigo-500/10 to-transparent text-indigo-400'
                  : 'hover:bg-slate-800/50 hover:text-white'
                  }`}
              >
                {isActive && (
                  <div className="absolute left-0 w-1.5 h-6 bg-indigo-500 rounded-r-full shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                )}
                <Icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-indigo-500' : 'text-slate-400'}`} />
                {!isCollapsed && <span className={`ml-4 text-[10px] font-black uppercase tracking-[0.15em] ${isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-white'}`}>{item.label}</span>}
                {isActive && !isCollapsed && (
                  <div className="ml-auto w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
          {!isCollapsed && (
            <div className="mb-4 p-3 bg-slate-800/40 rounded-2xl border border-slate-700/30">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white font-bold ring-2 ring-indigo-500/20 shadow-lg">
                  {user?.name?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-white truncate">{user?.name}</p>
                  <p className="text-[9px] text-slate-500 truncate uppercase tracking-widest font-bold mt-0.5">Administrator</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <Link
              to="/"
              className={`flex items-center group px-4 py-3 rounded-xl transition-all duration-300 ${isCollapsed ? 'justify-center' : ''
                } text-slate-400 hover:bg-slate-800 hover:text-white`}
            >
              <FiHome className="w-5 h-5 flex-shrink-0 group-hover:scale-110" />
              {!isCollapsed && <span className="ml-4 text-[10px] font-black uppercase tracking-widest">View Store</span>}
            </Link>

            <button
              onClick={handleLogout}
              className={`flex items-center group w-full px-4 py-3 rounded-xl transition-all duration-300 ${isCollapsed ? 'justify-center' : ''
                } text-rose-400 hover:bg-rose-500/10 hover:text-rose-300`}
            >
              <FiLogOut className="w-5 h-5 flex-shrink-0 group-hover:scale-110" />
              {!isCollapsed && <span className="ml-4 text-[10px] font-black uppercase tracking-widest">Sign Out</span>}
            </button>
          </div>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-24 w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-lg border-4 border-[#f8fafc] hover:scale-110 transition-transform z-50 invisible lg:visible"
        >
          {isCollapsed ? <FiChevronRight size={12} /> : <FiChevronLeft size={12} />}
        </button>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 transition-all duration-300 ease-in-out ${isCollapsed ? 'ml-20' : 'ml-72'}`}>
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-8 flex items-center justify-between shadow-sm">
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">
              {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
            </h1>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
              Control Center / {location.pathname.split('/').pop()}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-slate-100 rounded-full px-4 py-1.5 text-slate-500 invisible sm:flex">
              <span className="text-[10px] font-black uppercase tracking-widest">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-500 hover:border-indigo-100 hover:bg-indigo-50/50 transition-all shadow-sm">
              <FiBell className="w-5 h-5" />
            </button>

            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm">
              <img
                src={`https://ui-avatars.com/api/?name=${user?.name}&background=6366f1&color=fff&bold=true`}
                alt="user"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="p-8 max-w-[1600px] mx-auto animate-fadeIn min-h-[calc(100vh-80px)]">
          {children}
        </div>
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
