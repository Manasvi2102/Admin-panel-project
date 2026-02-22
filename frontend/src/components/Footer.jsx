import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiInstagram, FiLinkedin, FiMail, FiPhone, FiMapPin, FiArrowUp } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
  const { isAdmin } = useAuth();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-slate-950 text-white pt-24 pb-12 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-rose-600/5 rounded-full blur-[100px] translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand Identity */}
          <div className="space-y-8">
            <Link to="/" className="flex items-center gap-4 group">
              <div className="p-3 rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-600/20 rotate-[-5deg] group-hover:rotate-0 transition-transform duration-500">
                <span className="text-2xl">📚</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter italic uppercase leading-none">
                  BN <span className="text-indigo-500">.</span> Archive
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1">Digital Library</span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Curating the world's most influential literature. From timeless classics to modern masterpieces, we bridge the gap between stories and souls.
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: <FiGithub size={18} />, href: '#' },
                { icon: <FiTwitter size={18} />, href: '#' },
                { icon: <FiInstagram size={18} />, href: '#' },
                { icon: <FiLinkedin size={18} />, href: '#' }
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center hover:bg-indigo-600 hover:border-indigo-500 transition-all duration-300 group"
                >
                  <span className="group-hover:scale-110 transition-transform text-slate-400 group-hover:text-white">
                    {social.icon}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Core Navigation - Context Aware */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-8">
              {isAdmin ? 'System Modules' : 'Navigation'}
            </h4>
            <ul className="space-y-4">
              {(isAdmin ? [
                { name: 'Admin Dashboard', path: '/admin/dashboard' },
                { name: 'Books Management', path: '/admin/books' },
                { name: 'Order Logs', path: '/admin/orders' },
                { name: 'User Registry', path: '/admin/users' }
              ] : [
                { name: 'Terminal Home', path: '/' },
                { name: 'Full Catalog', path: '/books' },
                { name: 'Featured Works', path: '/featured' },
                { name: 'About Protocol', path: '/about' }
              ]).map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-slate-400 hover:text-white text-sm font-medium transition-colors flex items-center gap-2 group"
                  >
                    <span className="h-px w-0 bg-indigo-500 group-hover:w-4 transition-all"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categorization or Admin Quick Tools */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-8">
              {isAdmin ? 'Admin Utilities' : 'Categories'}
            </h4>
            <ul className="space-y-4">
              {(isAdmin ? [
                { name: 'System Performance', path: '/admin/dashboard' },
                { name: 'Database Status', path: '/admin/dashboard' },
                { name: 'Security Audit', path: '/admin/dashboard' },
                { name: 'Resource Allocation', path: '/admin/dashboard' }
              ] : [
                { name: 'Fiction Systems', path: '/books?category=fiction' },
                { name: 'Non-Fiction Data', path: '/books?category=non-fiction' },
                { name: 'Science & Logic', path: '/books?category=science-fiction' },
                { name: 'Mystery Modules', path: '/books?category=mystery-thriller' }
              ]).map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-slate-400 hover:text-white text-sm font-medium transition-colors flex items-center gap-2 group"
                  >
                    <span className="h-px w-0 bg-indigo-500 group-hover:w-4 transition-all"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Node */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-8">Contact Node</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-slate-900 border border-white/5 text-slate-400">
                  <FiMail size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Email</p>
                  <p className="text-sm font-medium text-slate-200">nexus@bnarchive.com</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-slate-900 border border-white/5 text-slate-400">
                  <FiPhone size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Interface</p>
                  <p className="text-sm font-medium text-slate-200">+1 (010) ARC-HIVE</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            &copy; {new Date().getFullYear()} BN Archive. System Version 2.0.4
          </p>

          <button
            onClick={scrollToTop}
            className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-900 border border-white/5 hover:bg-indigo-600 hover:border-indigo-500 transition-all duration-500"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-white">Back to Zenith</span>
            <FiArrowUp className="text-indigo-400 group-hover:text-white animate-bounce" size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
