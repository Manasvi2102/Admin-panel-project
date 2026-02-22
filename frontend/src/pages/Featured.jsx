import { useState, useEffect } from 'react';
import api from '../utils/api';
import BookCard from '../components/BookCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { FiStar, FiTrendingUp, FiZap, FiTarget, FiArrowRight, FiHexagon, FiCpu, FiNavigation } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Featured = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeaturedBooks = async () => {
            try {
                setLoading(true);
                // Assuming the backend supports featured=true query
                const response = await api.get('/books?featured=true&limit=12');
                setBooks(response.data.data);
            } catch (err) {
                setError('High-priority data sync failed.');
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedBooks();
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#fcfdfe]"><Loading size="lg" /></div>;
    if (error) return <div className="min-h-screen flex items-center justify-center bg-[#fcfdfe]"><ErrorMessage message={error} /></div>;

    return (
        <div className="min-h-screen bg-[#fcfdfe] pt-32 pb-20 relative overflow-hidden">
            {/* Dynamic Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10"></div>
            <div className="absolute bottom-1/4 left-0 w-[300px] h-[300px] bg-rose-50/50 rounded-full blur-3xl -translate-x-1/2 -z-10"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">

                {/* --- ELITE HEADER SECTION --- */}
                <div className="relative mb-32">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                        <div className="max-w-3xl space-y-8">
                            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-indigo-600 text-white shadow-2xl shadow-indigo-200">
                                <FiZap className="animate-bounce" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Priority Access</span>
                            </div>

                            <h1 className="text-7xl lg:text-9xl font-black text-slate-950 tracking-tighter italic uppercase leading-[0.8] transition-all hover:tracking-normal duration-700">
                                The <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-rose-500">Curated</span> <br /> Selection.
                            </h1>

                            <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-xl">
                                Exploring the frontiers of literature. These works represent the peak of human thought, imagination, and narrative complexity.
                            </p>
                        </div>

                        <div className="lg:w-1/3">
                            <div className="relative p-1 bg-gradient-to-br from-indigo-500 via-purple-500 to-rose-500 rounded-[3rem] group">
                                <div className="bg-slate-950 p-10 rounded-[2.8rem] space-y-8 group-hover:bg-slate-900 transition-colors duration-500">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400">
                                            <FiTarget size={28} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Metadata</p>
                                            <p className="text-white font-bold">Priority Status: Active</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-sm text-slate-400 italic">"Our algorithms have identified these entries as essential components of the current zeitgeist."</p>
                                        <div className="h-px w-full bg-white/5"></div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">System.Initialize(Featured_Core)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- FEATURED GRID --- */}
                <div className="relative">
                    {books.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                            {books.map((book, idx) => (
                                <div key={book._id} className="group relative" style={{ animationDelay: `${idx * 100}ms` }}>
                                    {/* Decorative number for design flair */}
                                    <span className="absolute -top-6 -left-4 text-8xl font-black text-slate-100 italic transition-all group-hover:text-indigo-50 -z-10 group-hover:scale-110 duration-700">
                                        0{idx + 1}
                                    </span>
                                    <BookCard book={book} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-40 bg-white rounded-[4rem] border-2 border-slate-100 shadow-sm">
                            <FiHexagon size={64} className="mx-auto text-slate-200 mb-8 animate-spin-slow" />
                            <h2 className="text-3xl font-black text-slate-950 uppercase italic tracking-tighter">Null Selection Detected</h2>
                            <p className="text-slate-400 mt-4 max-w-sm mx-auto">No priority artifacts have been indexed at this time. Please return to standard catalog.</p>
                            <Link to="/books" className="premium-pill mt-12 inline-block">Return to Master Archive</Link>
                        </div>
                    )}
                </div>

                {/* --- BOTTOM CTA --- */}
                <div className="mt-40 p-20 bg-slate-950 rounded-[4rem] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,rgba(99,102,241,0.1)_0%,transparent_50%)]"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
                        <div className="space-y-4">
                            <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter">Expand the Horizon.</h3>
                            <p className="text-slate-400 text-lg">Browse our full 10,000+ entry catalog for hidden gems.</p>
                        </div>
                        <Link to="/books" className="flex items-center gap-4 px-10 py-6 bg-white text-slate-950 rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-500 hover:text-white transition-all duration-500 group">
                            Master Registry <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>
                </div>

            </div>

            <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
        </div>
    );
};

export default Featured;
