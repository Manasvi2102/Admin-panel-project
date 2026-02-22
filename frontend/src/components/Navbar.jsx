import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX, FiSearch, FiArchive, FiCommand, FiActivity, FiLayers } from 'react-icons/fi';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { getCartItemsCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartItemsCount = getCartItemsCount();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <div className={`floating-nav ${isScrolled ? 'top-4 lg:w-[90%]' : 'top-8 lg:w-[95%] max-w-7xl'}`}>
      <div className={`mx-auto px-6 py-3 transition-all duration-700 rounded-[2.5rem] ${isScrolled
        ? 'bg-slate-950/80 backdrop-blur-2xl text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10'
        : 'bg-white/90 backdrop-blur-xl text-slate-900 border border-white shadow-[0_10px_40px_rgba(0,0,0,0.05)]'
        }`}>
        <div className="flex justify-between items-center h-14">

          {/* Unconventional Brand Identity */}
          <Link to="/" className="flex items-center gap-4 group">
            <div className={`p-2.5 rounded-2xl transition-all duration-500 group-hover:rotate-[15deg] group-hover:scale-110 shadow-lg ${isScrolled ? 'bg-indigo-600 shadow-indigo-600/30' : 'bg-slate-900 shadow-slate-900/20'
              }`}>
              <FiArchive className="text-white w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter leading-none italic uppercase">
                BN <span className="text-indigo-500">.</span> Archive
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${isScrolled ? 'bg-indigo-400' : 'bg-indigo-600'}`}></span>
                <span className="text-[8px] font-black uppercase tracking-[0.3em] opacity-40">Digital Library</span>
              </div>
            </div>
          </Link>

          {/* Central Command - Desktop Navigation */}
          <div className={`hidden lg:flex items-center gap-1 p-1 rounded-full transition-colors duration-500 ${isScrolled ? 'bg-white/5' : 'bg-slate-100'}`}>
            {(isAdmin ? [
              { label: 'Dashboard', path: '/admin/dashboard', icon: <FiActivity size={12} /> },
              { label: 'Manage Books', path: '/admin/books', icon: <FiLayers size={12} /> },
              { label: 'Manage Orders', path: '/admin/orders', icon: <FiArchive size={12} /> },
              { label: 'User Index', path: '/admin/users', icon: <FiUser size={12} /> }
            ] : [
              { label: 'Home', path: '/', icon: <FiActivity size={12} /> },
              { label: 'Catalog', path: '/books', icon: <FiLayers size={12} /> },
              { label: 'Featured', path: '/featured', badge: 'New' }
            ]).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all relative overflow-hidden group flex items-center gap-2 ${location.pathname === link.path
                  ? (isScrolled ? 'bg-white text-slate-900 shadow-xl' : 'bg-slate-900 text-white shadow-lg')
                  : (isScrolled ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-white')
                  }`}
              >
                {link.icon && <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute left-2">{link.icon}</span>}
                <span className="relative z-10 transition-transform group-hover:translate-x-1">{link.label}</span>
                {link.badge && (
                  <span className="bg-indigo-500 text-white text-[7px] px-1.5 py-0.5 rounded-md ml-1 animate-bounce">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Contextual Actions */}
          <div className="flex items-center gap-3">

            {/* Minimal Search Trigger */}
            <form onSubmit={handleSearch} className="hidden lg:flex items-center relative group">
              <FiSearch className={`absolute left-4 transition-colors ${isScrolled ? 'text-slate-500 group-focus-within:text-indigo-400' : 'text-slate-400 group-focus-within:text-slate-900'}`} size={16} />
              <input
                type="text"
                placeholder="Meta Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-11 pr-4 py-2.5 rounded-full text-[10px] font-black w-24 focus:w-56 transition-all duration-700 outline-none border-none ${isScrolled ? 'bg-white/5 text-white placeholder-slate-600 focus:bg-white/10' : 'bg-slate-100 text-slate-900 placeholder-slate-400 focus:bg-white focus:shadow-inner'
                  }`}
              />
              <div className="absolute right-4 opacity-30 pointer-events-none invisible group-focus-within:visible">
                <FiCommand size={14} />
              </div>
            </form>

            <div className={`hidden lg:block w-px h-8 mx-2 ${isScrolled ? 'bg-white/10' : 'bg-slate-200'}`}></div>

            {/* Dynamic Status / User */}
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/cart" className={`relative p-3 rounded-2xl transition-all group ${isScrolled ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-white text-slate-900 hover:bg-slate-50 shadow-sm border border-slate-100'
                  }`}>
                  <FiShoppingCart size={18} className="group-hover:scale-110 group-hover:rotate-12 transition-transform" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-lg shadow-lg border-2 border-transparent">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>

                <div className="relative group/user">
                  <button className={`flex items-center gap-3 p-1 pr-4 rounded-2xl transition-all ${isScrolled ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}>
                    <div className="w-10 h-10 rounded-xl bg-indigo-500 overflow-hidden flex items-center justify-center text-white font-black text-xs shadow-lg shadow-indigo-500/20">
                      {user.avatar ? <img src={user.avatar} alt="" /> : user.name.charAt(0)}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">{user.name.split(' ')[0]}</span>
                  </button>

                  <div className="absolute right-0 mt-4 w-60 bg-slate-950/95 backdrop-blur-2xl text-white rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)] p-4 border border-white/10 opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all duration-500 translate-y-4 group-hover/user:translate-y-0 overflow-hidden z-50">
                    <div className="px-4 py-4 mb-3 border-b border-white/5">
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] leading-none mb-2">Access Status</p>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <p className="text-xs font-bold text-slate-300">Authorized Session</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Link to="/profile" className="flex items-center gap-4 px-4 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/5 rounded-2xl transition-all group">
                        <FiUser size={16} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                        <span>My Profile</span>
                      </Link>

                      {isAdmin && (
                        <Link to="/admin/dashboard" className="flex items-center gap-4 px-4 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-500/10 rounded-2xl transition-all text-indigo-400 group">
                          <FiArchive size={16} className="group-hover:rotate-12 transition-transform" />
                          <span>Admin Core</span>
                        </Link>
                      )}

                      <button onClick={logout} className="w-full flex items-center gap-4 px-4 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all mt-2 group">
                        <FiLogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Terminate Security</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className={`px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-2xl ${isScrolled ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:bg-slate-100'
                  }`}>Login</Link>
                <Link to="/register" className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl ${isScrolled ? 'bg-indigo-500 text-white hover:bg-indigo-600' : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-slate-200'
                  }`}>Initialize</Link>
              </div>
            )}

            {/* Menu Trigger - Mobile */}
            <button
              className={`lg:hidden p-3 rounded-2xl transition-all ${isScrolled ? 'bg-white/5 text-white' : 'bg-slate-100 text-slate-900'}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-4 mx-2 bg-slate-950/95 backdrop-blur-2xl p-8 rounded-[3rem] shadow-2xl border border-white/10 space-y-8 animate-fadeIn overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 rounded-full blur-3xl"></div>

          <nav className="space-y-6 relative z-10">
            {(isAdmin ? [
              { l: 'Dashboard', p: '/admin/dashboard' },
              { l: 'Books', p: '/admin/books' },
              { l: 'Orders', p: '/admin/orders' },
              { l: 'Users', p: '/admin/users' }
            ] : [
              { l: 'Home', p: '/' },
              { l: 'Catalog', p: '/books' },
              { l: 'Featured', p: '/featured' }
            ]).map(link => (
              <Link
                key={link.l}
                to={link.p}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between group"
              >
                <span className="text-3xl font-black text-white italic uppercase tracking-tighter group-active:text-indigo-400 transition-colors">{link.l}</span>
                <div className="h-px flex-1 bg-white/5 mx-4 group-hover:bg-indigo-500/50 transition-colors"></div>
                <FiCommand size={20} className="text-white/20 group-hover:text-indigo-500" />
              </Link>
            ))}
          </nav>

          <div className="pt-8 border-t border-white/5 flex flex-col gap-4 relative z-10">
            {!user ? (
              <>
                <Link to="/login" className="w-full py-5 text-center bg-white/5 text-white border border-white/10 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white/10" onClick={() => setMobileMenuOpen(false)}>Signature Access</Link>
                <Link to="/register" className="w-full py-5 text-center bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-indigo-600/20" onClick={() => setMobileMenuOpen(false)}>Initialize Identity</Link>
              </>
            ) : (
              <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full py-5 text-center bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px]">End Current Protocol</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;

