import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import BookCard from '../components/BookCard';
import Loading from '../components/Loading';
import { FiArrowRight, FiBook, FiStar, FiChevronLeft, FiChevronRight, FiUsers, FiAward, FiShoppingBag, FiSearch, FiGlobe, FiTruck, FiShield, FiExternalLink, FiLayout, FiDatabase } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroSlide, setHeroSlide] = useState(0);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const [featRes, bestRes, newRes] = await Promise.all([
        api.get('/books?featured=true&limit=4'),
        api.get('/books?bestSeller=true&limit=4'),
        api.get('/books?sort=-createdAt&limit=4')
      ]);
      setFeaturedBooks(featRes.data?.data || []);
      setBestSellers(bestRes.data?.data || []);
      setNewArrivals(newRes.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const heroSlides = [
    {
      title: "COLLECTED DATA & HUMAN KNOWLEDGE.",
      subtitle: "The world's most sophisticated literary archive is now operational.",
      image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop",
      code: "PROTOCOL-91"
    },
    {
      title: "UNRESTRICTED ACCESS TO THE VAULT.",
      subtitle: "Authenticated users may now browse the Tier-1 index of bestsellers.",
      image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2000&auto=format&fit=crop",
      code: "VAULT-ACCESS"
    }
  ];

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#fcfdfe]"><Loading size="lg" /></div>;

  return (
    <div className="min-h-screen bg-[#fcfdfe] overflow-x-hidden pt-24 px-4 lg:px-6">

      {/* --- CINEMATIC HERO: PROTOCOL STYLE --- */}
      <section className="relative h-[85vh] rounded-[3rem] lg:rounded-[4rem] overflow-hidden bg-slate-900 border border-white/5 shadow-2xl">
        <div className="absolute inset-0">
          <img
            src={heroSlides[heroSlide].image}
            className="w-full h-full object-cover scale-105 transition-all duration-[3000ms] ease-out brightness-50"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-930 via-transparent to-slate-930/50"></div>
          {/* Grid Overlay for Uniqueness */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
        </div>

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-6xl mx-auto px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            <div className="lg:col-span-8 space-y-10">
              <div className="inline-flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-2.5 rounded-full">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">{heroSlides[heroSlide].code}</span>
              </div>

              <h1 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter leading-[0.85]">
                {heroSlides[heroSlide].title}
              </h1>

              <p className="max-w-xl text-lg md:text-xl text-slate-400 font-medium leading-relaxed">
                {heroSlides[heroSlide].subtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-5 pt-4">
                <Link to="/books" className="px-12 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-white hover:text-slate-900 transition-all duration-500 shadow-2xl shadow-indigo-600/20 group">
                  <span className="flex items-center gap-3">Initialize Browse <FiArrowRight className="group-hover:translate-x-2 transition-transform" /></span>
                </Link>
                <Link to="/register" className="px-12 py-5 bg-white/5 backdrop-blur-xl text-white border border-white/10 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-white/10 transition-all">Identity Registration</Link>
              </div>
            </div>

            {/* Asymmetric Side Stat for Uniqueness */}
            <div className="hidden lg:block lg:col-span-4 translate-y-20">
              <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[3rem] space-y-8 transform hover:skew-x-2 transition-all">
                <div className="space-y-2">
                  <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest leading-none">Global Index</p>
                  <p className="text-4xl font-black text-white">124.8K <span className="text-xs text-slate-500 font-bold ml-2">FILES</span></p>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>Sync Status</span>
                    <span className="text-emerald-400">99.9% Operational</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-[99%] h-full bg-indigo-500"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- ARCHIVAL METADATA STRIP --- */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: FiGlobe, label: 'Geo-Indexing', val: 'Available in 204 Regions' },
            { icon: FiTruck, label: 'Deployment', val: 'Express Allocation < 48h' },
            { icon: FiShield, label: 'Authenticity', val: '100% Verified Artifacts' },
            { icon: FiDatabase, label: 'Central Node', val: 'Mainframe Linked 24/7' }
          ].map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex flex-col items-center text-center space-y-4 hover:shadow-2xl hover:border-indigo-100 group transition-all duration-700">
              <div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 flex items-center justify-center text-slate-900 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                <item.icon size={28} />
              </div>
              <div>
                <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{item.label}</p>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">{item.val}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- PRIMARY INDEX: FEATURED --- */}
      <section className="py-24 bg-white/50 rounded-[4rem] border border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-40 opacity-[0.03] select-none pointer-events-none transition-all group-hover:opacity-10">
          <FiLayout size={600} />
        </div>

        <div className="max-w-7xl mx-auto px-8 space-y-20 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="text-center lg:text-left space-y-4">
              <div className="inline-flex items-center gap-3 text-indigo-600 bg-indigo-50 px-5 py-2 rounded-full">
                <FiStar className="fill-current" size={14} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Master Selection</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none italic uppercase">Curated Spotlight</h2>
              <p className="text-slate-500 font-medium text-lg max-w-xl">Each artifact here represents a significant milestone in intellectual development.</p>
            </div>
            <Link to="/books" className="px-10 py-5 bg-slate-900 text-white rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:bg-indigo-600 transition-all flex items-center gap-4">
              Enter Catalog <FiExternalLink />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {featuredBooks.map(book => <BookCard key={book._id} book={book} />)}
          </div>
        </div>
      </section>

      {/* --- ASYMMETRIC CONTENT: THE ARCHIVE MISSION --- */}
      <section className="py-40">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
          <div className="lg:col-span-5 relative group">
            <div className="aspect-[4/5] bg-slate-900 rounded-[4rem] overflow-hidden rotate-[-3deg] group-hover:rotate-0 transition-transform duration-700 shadow-2xl">
              <img src="https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover opacity-60 hover:scale-105 transition-transform duration-1000" alt="Mission" />
              <div className="absolute inset-x-8 bottom-8 p-10 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[3rem] text-white">
                <p className="text-4xl font-black mb-2 italic">98%</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Collection Reliability</p>
              </div>
            </div>
            {/* Abstract Shape for Uniqueness */}
            <div className="absolute -z-10 -top-10 -left-10 w-40 h-40 bg-indigo-50 rounded-full blur-3xl"></div>
          </div>

          <div className="lg:col-span-7 space-y-10">
            <h2 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none uppercase italic">More than just <br /> <span className="text-indigo-600">Inventory.</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <p className="text-xl font-black text-slate-900 leading-tight">Authentic Artifacts.</p>
                <p className="text-slate-500 font-medium leading-relaxed">Every item in our collection is meticulously verified for intellectual integrity and physical authenticity.</p>
              </div>
              <div className="space-y-4">
                <p className="text-xl font-black text-slate-900 leading-tight">Private Access.</p>
                <p className="text-slate-500 font-medium leading-relaxed">Join a global community of scholars and professionals with restricted access to rare indexing data.</p>
              </div>
            </div>
            <div className="pt-6">
              <Link to="/register" className="premium-pill inline-block">Execute Boarding</Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECONDARY TERMINAL: RECENT --- */}
      <section className="py-32 bg-slate-900 rounded-[4rem] lg:rounded-[6rem] relative overflow-hidden">
        {/* Uniqueness: Decorative Circuit Pattern */}
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-8 space-y-20 relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8">
            <div className="space-y-4">
              <span className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.4em]">Live Distribution</span>
              <h2 className="text-5xl md:text-6xl font-black text-white italic tracking-tighter uppercase">Recent Acquisitions</h2>
            </div>
            <Link to="/books?sort=-createdAt" className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all">Full Registry View</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {newArrivals.map(book => (
              <div key={book._id} className="bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 p-2 hover:border-indigo-500/50 transition-all duration-700">
                <BookCard book={book} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- NEXUS NEWSLETTER --- */}
      <section className="py-40">
        <div className="max-w-5xl mx-auto bg-white p-16 lg:p-32 rounded-[4rem] shadow-2xl border border-slate-100 text-center space-y-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600"></div>
          <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-slate-900 shadow-sm group hover:bg-indigo-600 hover:text-white transition-all duration-700">
            <FiDatabase size={40} className="animate-pulse-soft" />
          </div>
          <div className="space-y-4">
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase">Synchronize Now.</h2>
            <p className="text-slate-500 font-medium text-lg max-w-lg mx-auto leading-relaxed">Receive metadata updates and protocol shifts directly to your secure communications terminal.</p>
          </div>
          <div className="max-w-md mx-auto relative group">
            <input type="email" placeholder="Identity Handle (Email)" className="w-full px-10 py-7 bg-slate-50 border-none rounded-[2rem] text-sm font-black focus:ring-4 focus:ring-indigo-100 transition-all outline-none" />
            <button className="absolute right-3 top-3 bottom-3 px-8 bg-slate-900 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all duration-500">Authorize</button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
