import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  FiBook,
  FiShoppingBag,
  FiUsers,
  FiTrendingUp,
  FiClock,
  FiBox,
  FiChevronRight,
  FiArrowUpRight
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchStats();
  }, [isAdmin]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/dashboard/stats');
      setStats(response.data.data);
    } catch (err) {
      setError('Failed to fetch dashboard statistics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="h-[60vh] flex items-center justify-center">
          <Loading size="lg" />
        </div>
      </AdminLayout>
    );
  }

  if (error || !stats) {
    return (
      <AdminLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <ErrorMessage message={error || 'Failed to load dashboard data'} />
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${stats.overview.totalRevenue.toLocaleString()}`,
      icon: FiTrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      label: 'Lifetime Earnings'
    },
    {
      title: 'Active Orders',
      value: stats.overview.totalOrders,
      icon: FiShoppingBag,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      label: 'Placed Orders'
    },
    {
      title: 'Catalog Size',
      value: stats.overview.totalBooks,
      icon: FiBook,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      label: 'Unique Titles'
    },
    {
      title: 'Active Users',
      value: stats.overview.totalUsers,
      icon: FiUsers,
      color: 'text-slate-600',
      bg: 'bg-slate-50',
      label: 'Registered Members'
    },
  ];

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn">

        {/* Simple Professional Header */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Business Overview</h1>
            <p className="text-slate-500 font-medium">Welcome back, Admin. Here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-5 py-2.5 rounded-xl border border-slate-100">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Live System Status
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                  <stat.icon size={24} />
                </div>
                <div className="flex items-center text-emerald-500 font-bold text-xs bg-emerald-50 px-2 py-1 rounded-lg">
                  <FiArrowUpRight size={14} />
                  <span>12%</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.title}</p>
                <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                <p className="text-[10px] text-slate-400 font-medium mt-2">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Transactions List */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                  <FiClock size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Recent Orders</h3>
              </div>
              <button onClick={() => navigate('/admin/orders')} className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                View All <FiChevronRight />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 text-left">
                    <th className="pb-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Order ID</th>
                    <th className="pb-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Customer</th>
                    <th className="pb-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                    <th className="pb-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {stats.recentOrders?.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 text-xs font-bold text-slate-900">#{order._id.slice(-6).toUpperCase()}</td>
                      <td className="py-4 text-sm text-slate-600 font-medium">{order.user?.name || 'Guest'}</td>
                      <td className="py-4 text-sm font-bold text-slate-900 italic">₹{order.total.toLocaleString()}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${order.orderStatus === 'delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                          }`}>
                          {order.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
                <FiBox size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Low Stock Issues</h3>
            </div>

            <div className="space-y-4">
              {stats.lowStockBooks?.slice(0, 5).map((book) => (
                <div key={book._id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group">
                  <div className="max-w-[150px]">
                    <p className="text-xs font-bold text-slate-800 line-clamp-1">{book.title}</p>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter mt-0.5">{book.stock} units remaining</p>
                  </div>
                  <button onClick={() => navigate('/admin/books')} className="p-2 bg-white text-slate-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all border border-slate-200">
                    <FiArrowUpRight />
                  </button>
                </div>
              ))}
              <button
                onClick={() => navigate('/admin/books')}
                className="w-full py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border border-dashed border-slate-200 rounded-2xl hover:bg-slate-50 transition-all"
              >
                Inspect Full Catalog
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
