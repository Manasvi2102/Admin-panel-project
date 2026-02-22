import { FiBookOpen, FiShield, FiGlobe, FiTarget, FiHash, FiCpu, FiUsers, FiHexagon } from 'react-icons/fi';

const About = () => {
    const architects = [
        { id: 1, name: 'Architect 01', role: 'Level 7 Authorized', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600' },
        { id: 2, name: 'Architect 02', role: 'Core Sync Lead', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600' },
        { id: 3, name: 'Architect 03', role: 'Security Protocol', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=600' },
        { id: 4, name: 'Architect 04', role: 'Index Architect', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600' },
    ];

    return (
        <div className="min-h-screen bg-[#fcfdfe] pt-32 pb-20 overflow-x-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-indigo-50/50 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 -z-10"></div>
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-rose-50/30 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 -z-10"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">

                {/* --- HERO SECTION --- */}
                <div className="mb-32 relative">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-2/3 space-y-8">
                            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-slate-900 text-white shadow-2xl shadow-slate-200">
                                <FiShield className="animate-pulse text-indigo-400" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Protocol Alpha V2.0</span>
                            </div>

                            <h1 className="text-7xl lg:text-9xl font-black text-slate-950 tracking-tighter italic uppercase leading-[0.8] mb-12">
                                Redefining <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-rose-500">Knowledge</span> <br /> Access.
                            </h1>

                            <p className="text-slate-500 font-medium text-xl leading-relaxed max-w-2xl">
                                BN Archive is not just a bookstore; it is a digital repository dedicated to the preservation and dissemination of high-value literature. Our protocol ensures that every byte of information serves a higher purpose.
                            </p>
                        </div>

                        <div className="lg:w-1/3 relative">
                            <div className="w-full aspect-square rounded-[4rem] bg-indigo-600 overflow-hidden rotate-3 relative group">
                                <div className="absolute inset-0 bg-slate-950 opacity-20 group-hover:opacity-0 transition-opacity duration-700"></div>
                                <div className="absolute inset-0 flex items-center justify-center p-12">
                                    <FiHexagon className="w-full h-full text-white/20 animate-spin-slow" />
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <FiBookOpen className="text-white w-24 h-24" />
                                </div>
                            </div>
                            {/* Floating Stat Card */}
                            <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 hidden lg:block animate-float">
                                <p className="text-4xl font-black text-slate-950 italic">10K+</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Artifacts Indexed</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- PROTOCOL PILLARS --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-40">
                    {[
                        {
                            icon: <FiTarget size={24} />,
                            title: "Curation Engine",
                            desc: "Our selection logic prioritizes intellectual depth over commercial mass. Only the most significant works enter our archive."
                        },
                        {
                            icon: <FiHash size={24} />,
                            title: "Metadata Integrity",
                            desc: "Every entry is cross-referenced with global databases to ensure absolute accuracy in categorization and pricing."
                        },
                        {
                            icon: <FiGlobe size={24} />,
                            title: "Universal Node",
                            desc: "Accessing the archive from anywhere in the cluster. Our distributed systems ensure 99.9% protocol uptime."
                        }
                    ].map((pillar, idx) => (
                        <div key={idx} className="p-10 rounded-[3rem] bg-white border border-slate-100 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 group">
                            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-indigo-600 mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-500">
                                {pillar.icon}
                            </div>
                            <h3 className="text-xl font-black text-slate-950 uppercase italic tracking-tight mb-4">{pillar.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">{pillar.desc}</p>
                        </div>
                    ))}
                </div>

                {/* --- INTERACTIVE STATS --- */}
                <div className="p-12 lg:p-24 bg-slate-950 rounded-[4rem] text-white relative overflow-hidden mb-40">
                    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,rgba(99,102,241,0.1)_0%,transparent_50%)]"></div>
                    <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                        <div>
                            <p className="text-5xl font-black italic mb-2">98%</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Sync Rate</p>
                        </div>
                        <div>
                            <p className="text-5xl font-black italic mb-2">24h</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Protocol Support</p>
                        </div>
                        <div>
                            <p className="text-5xl font-black italic mb-2">0.2s</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Query Time</p>
                        </div>
                        <div>
                            <p className="text-5xl font-black italic mb-2">156</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Active Nodes</p>
                        </div>
                    </div>
                </div>

                {/* --- THE CREW / SYSTEM ARCHITECTS --- */}
                <div className="space-y-16">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl lg:text-5xl font-black text-slate-950 uppercase italic tracking-tighter">System Architects.</h2>
                        <p className="text-slate-500 font-medium">The minds behind the protocol.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {architects.map((arc) => (
                            <div key={arc.id} className="group relative">
                                <div className="aspect-[3/4] rounded-[2.5rem] bg-slate-100 overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-700 shadow-xl border border-slate-100">
                                    <img
                                        src={arc.img}
                                        alt={arc.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
                                    <div className="absolute bottom-8 left-8 text-white">
                                        <p className="text-lg font-black uppercase italic tracking-tighter leading-none">{arc.name}</p>
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-indigo-400 mt-2">{arc.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
};

export default About;

