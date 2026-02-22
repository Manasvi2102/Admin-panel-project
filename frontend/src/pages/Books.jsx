import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import BookCard from '../components/BookCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { FiSearch, FiFilter, FiX, FiGrid, FiList, FiCommand, FiActivity, FiTerminal, FiDatabase, FiArrowRight } from 'react-icons/fi';

const Books = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({ totalBooks: 0, totalCategories: 0 });

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: '',
    maxPrice: '',
    sort: '-createdAt',
  });

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v)),
      });
      const response = await api.get(`/books?${params}`);
      setBooks(response.data.data);
      setTotalPages(response.data.pages);
    } catch (err) {
      setError('Database link interrupted.');
    } finally {
      setLoading(false);
    }
  };

  const fetchInitialData = async () => {
    try {
      const [catRes, statsRes] = await Promise.all([
        api.get('/categories'),
        api.get('/books/stats')
      ]);
      setCategories(catRes.data.data);
      setStats({
        totalBooks: statsRes.data?.data?.books || 0,
        totalCategories: catRes.data.data.length
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [currentPage, filters]);

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] pt-32 pb-20 px-4 lg:px-8">
      <div className="max-w-[1440px] mx-auto space-y-12">

        {/* --- UNCONVENTIONAL HEADER: TERMINAL STYLE --- */}
        <div className="relative group">
          <div className="absolute inset-0 bg-slate-900 rounded-[3rem] lg:rounded-[4rem] group-hover:rotate-1 transition-transform duration-700"></div>
          <div className="relative bg-white p-12 lg:p-20 rounded-[3rem] lg:rounded-[4rem] shadow-xl border border-slate-100 flex flex-col lg:flex-row lg:items-end justify-between gap-12 overflow-hidden transition-transform duration-700 group-hover:-translate-x-1 group-hover:-translate-y-1">
            {/* Decal background */}
            <div className="absolute right-0 top-0 opacity-[0.03] select-none pointer-events-none p-20 transform translate-x-1/4">
              <FiTerminal size={400} />
            </div>

            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-4 text-indigo-600">
                <FiDatabase className="animate-pulse" size={20} />
                <span className="text-[11px] font-black uppercase tracking-[0.4em]">Protocol Index: Tier 1</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter italic uppercase leading-[0.85]">
                Master <br /> <span className="text-indigo-600">Archive.</span>
              </h1>
              <div className="flex items-center gap-10 pt-4">
                <div>
                  <p className="text-2xl font-black text-slate-900">{stats.totalBooks.toLocaleString()}</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Total Indexed</p>
                </div>
                <div className="w-px h-10 bg-slate-100"></div>
                <div>
                  <p className="text-2xl font-black text-slate-900">{stats.totalCategories}</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Cross-References</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-slate-50 p-2.5 rounded-3xl z-10">
              <button onClick={() => setViewMode('grid')} className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest ${viewMode === 'grid' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-900'}`}>
                <FiGrid size={16} /> Grid
              </button>
              <button onClick={() => setViewMode('list')} className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest ${viewMode === 'list' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-900'}`}>
                <FiList size={16} /> List
              </button>
            </div>
          </div>
        </div>

        {/* --- DYNAMIC FILTER COMMAND BAR --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-4">
          <div className="lg:col-span-8 relative group">
            <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-30">
              <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold">CMD</span>
              <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold">K</span>
            </div>
            <input
              type="text"
              placeholder="Query library mainframe (ID, Meta, Title)..."
              className="w-full pl-16 pr-24 py-6 bg-white border-2 border-slate-50 rounded-[2rem] shadow-sm text-sm font-black text-slate-900 focus:border-indigo-100 focus:bg-slate-50/50 transition-all outline-none"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          <div className="lg:col-span-4 flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex-1 flex items-center justify-center gap-3 py-6 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all ${showFilters ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-200' : 'bg-white border-2 border-slate-50 text-slate-600 hover:bg-slate-50'
                }`}
            >
              <FiFilter /> Refine Parameters
            </button>
            <div className="flex-1 relative">
              <select
                className="w-full py-6 pr-10 pl-6 bg-slate-100 text-slate-900 rounded-[2rem] text-[10px] font-black uppercase tracking-widest outline-none appearance-none cursor-pointer hover:bg-slate-200 transition-all"
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
              >
                <option value="-createdAt">Newest Entry</option>
                <option value="-ratings.average">Authority Rank</option>
                <option value="price">Value (Low-High)</option>
                <option value="-price">Value (High-Low)</option>
              </select>
              <FiCommand className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12} />
            </div>
          </div>
        </div>

        {/* --- COLLAPSIBLE PARAMETERS: TERMINAL DESIGN --- */}
        {showFilters && (
          <div className="bg-slate-50 p-10 rounded-[3rem] border-2 border-slate-100 shadow-inner animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                  <FiDatabase size={12} /> Classification
                </label>
                <select className="w-full p-5 bg-white border border-slate-100 rounded-2xl text-[11px] font-black uppercase outline-none focus:ring-4 focus:ring-indigo-100" value={filters.category} onChange={(e) => handleFilterChange('category', e.target.value)}>
                  <option value="">All Categories</option>
                  {categories.map(c => <option key={c._id} value={c.slug}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                  Value Ceiling
                </label>
                <input type="number" placeholder="MAX VAL" className="w-full p-5 bg-white border border-slate-100 rounded-2xl text-[11px] font-black outline-none focus:ring-4 focus:ring-indigo-100" value={filters.maxPrice} onChange={(e) => handleFilterChange('maxPrice', e.target.value)} />
              </div>
              <div className="md:col-span-2 flex items-end justify-end">
                <button onClick={() => setFilters({ search: '', category: '', minPrice: '', maxPrice: '', sort: '-createdAt' })} className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 rounded-2xl transition-all flex items-center gap-3">
                  <FiX /> Reset All Constraints
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- REGISTRY STATUS --- */}
        {loading ? (
          <div className="py-40 text-center"><Loading size="lg" /></div>
        ) : books.length === 0 ? (
          <div className="py-40 text-center bg-white rounded-[4rem] border-4 border-dashed border-slate-50 flex flex-col items-center justify-center space-y-8 animate-fadeIn">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
              <FiActivity size={48} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 italic uppercase">Artifact Sync Failure.</h3>
              <p className="text-slate-400 font-medium tracking-tight">Broaden your meta-parameters to locate the desired indexing data.</p>
            </div>
            <button onClick={() => setFilters({ search: '', category: '', minPrice: '', maxPrice: '', sort: '-createdAt' })} className="premium-pill">Initialize Global Refresh</button>
          </div>
        ) : (
          <div className="space-y-20">
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4' : 'grid-cols-1'} gap-10 lg:gap-12`}>
              {books.map((book, idx) => (
                <div key={book._id} className="animate-fadeIn" style={{ animationDelay: `${idx * 50}ms` }}>
                  <BookCard book={book} />
                </div>
              ))}
            </div>

            {/* --- PAGINATION PROTOCOL --- */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 py-10 transition-all">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-14 h-14 lg:w-40 lg:h-16 flex items-center justify-center bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all disabled:opacity-20 shadow-sm">
                  <FiX className="rotate-45 block lg:hidden" /> <span className="hidden lg:block">Roll Back</span>
                </button>
                <div className="hidden sm:flex items-center gap-3">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                    <button key={n} onClick={() => setCurrentPage(n)} className={`w-14 h-14 lg:w-16 lg:h-16 rounded-2xl text-xs font-black transition-all ${currentPage === n ? 'bg-slate-900 text-white shadow-2xl scale-110' : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-100 shadow-sm'}`}>{n}</button>
                  ))}
                </div>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-14 h-14 lg:w-40 lg:h-16 flex items-center justify-center bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all disabled:opacity-20 shadow-sm">
                  <FiArrowRight className="block lg:hidden" /> <span className="hidden lg:block">Next Advance</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Books;
