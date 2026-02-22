import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';
import {
  FiSearch,
  FiFilter,
  FiDownload,
  FiEye,
  FiRefreshCw,
  FiPackage,
  FiDollarSign,
  FiCheckCircle,
  FiActivity,
  FiCreditCard,
  FiCalendar,
  FiChevronDown,
  FiShoppingBag,
  FiClock,
  FiXCircle,
  FiTruck
} from 'react-icons/fi';

const AdminOrders = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchOrders();
  }, [isAdmin]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders');
      const ordersData = response.data.data;
      setOrders(ordersData);
      setFilteredOrders(ordersData);

      const statsObj = {
        total: ordersData.length,
        pending: ordersData.filter(o => o.orderStatus === 'pending').length,
        processing: ordersData.filter(o => o.orderStatus === 'processing').length,
        shipped: ordersData.filter(o => o.orderStatus === 'shipped').length,
        delivered: ordersData.filter(o => o.orderStatus === 'delivered').length,
        cancelled: ordersData.filter(o => o.orderStatus === 'cancelled').length,
        totalRevenue: ordersData
          .filter(o => o.paymentStatus === 'paid')
          .reduce((sum, o) => sum + o.total, 0)
      };
      setStats(statsObj);
    } catch (err) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = orders;
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter) filtered = filtered.filter(order => order.orderStatus === statusFilter);
    if (paymentFilter) filtered = filtered.filter(order => order.paymentStatus === paymentFilter);
    if (dateFilter) {
      const today = new Date();
      const filterDate = new Date(today);
      if (dateFilter === 'today') filterDate.setHours(0, 0, 0, 0);
      else if (dateFilter === 'week') filterDate.setDate(today.getDate() - 7);
      else if (dateFilter === 'month') filterDate.setMonth(today.getMonth() - 1);

      if (dateFilter !== '' && dateFilter !== 'all') {
        filtered = filtered.filter(order => new Date(order.createdAt) >= filterDate);
      }
    }
    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, paymentFilter, dateFilter]);

  const handleStatusUpdate = async (orderId, orderStatus, paymentStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { orderStatus, paymentStatus });
      toast.success('Status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'shipped': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'processing': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'cancelled': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  if (loading && orders.length === 0) {
    return (
      <AdminLayout>
        <div className="h-[60vh] flex items-center justify-center">
          <Loading size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn">

        {/* Professional Header */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <FiShoppingBag size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Order Management</h1>
              <p className="text-slate-500 font-medium">Monitoring and processing customer fulfillment</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchOrders}
              className="p-4 bg-slate-50 text-slate-500 rounded-2xl hover:bg-slate-100 transition-all border border-slate-100"
            >
              <FiRefreshCw className={loading ? 'animate-spin' : ''} size={20} />
            </button>
            <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl hover:bg-blue-600 transition-all font-bold text-sm flex items-center gap-3 shadow-lg shadow-slate-100">
              <FiDownload />
              Export List
            </button>
          </div>
        </div>

        {/* Action Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Orders', value: stats.total, icon: FiPackage, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Net Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: FiDollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Fulfilled', value: stats.delivered, icon: FiCheckCircle, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Pending Action', value: stats.pending + stats.processing, icon: FiActivity, color: 'text-amber-600', bg: 'bg-amber-50' }
          ].map((item, id) => (
            <div key={id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center`}>
                <item.icon size={20} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                <p className="text-xl font-black text-slate-800">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Advanced Filters */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-5 relative">
              <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Order ID, Name or Email..."
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="lg:col-span-2 relative">
              <FiFilter className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
              <select className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-xs font-bold uppercase tracking-widest focus:ring-2 focus:ring-blue-500 appearance-none outline-none" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="lg:col-span-2 relative">
              <FiCreditCard className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
              <select className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-xs font-bold uppercase tracking-widest focus:ring-2 focus:ring-blue-500 appearance-none outline-none" value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}>
                <option value="">Payment</option>
                <option value="pending">Unpaid</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div className="lg:col-span-3 flex items-center justify-end">
              <button
                onClick={() => { setSearchTerm(''); setStatusFilter(''); setPaymentFilter(''); setDateFilter(''); }}
                className="text-xs font-bold text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </div>

        {/* Master Registry Table */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Order ID</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Customer</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status / Payment</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="px-8 py-5 text-right text-[11px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg">#{order._id.slice(-8).toUpperCase()}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-xs uppercase">
                          {order.user?.name?.charAt(0) || 'G'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{order.user?.name || 'Guest User'}</p>
                          <p className="text-[10px] text-slate-400 font-medium truncate max-w-[140px]">{order.user?.email || 'Walk-in'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div>
                        <p className="text-sm font-black text-slate-900">₹{order.total.toLocaleString()}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{order.items.length} Items</p>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="space-y-2">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border block w-fit ${getStatusStyle(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest block w-fit border ${order.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-100'
                          }`}>
                          {order.paymentStatus}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-xs font-bold text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/admin/orders/${order._id}`)}
                          className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        >
                          <FiEye size={18} />
                        </button>
                        <select
                          onChange={(e) => {
                            const [o, p] = e.target.value.split('|');
                            handleStatusUpdate(order._id, o, p);
                          }}
                          className="text-[10px] font-bold uppercase tracking-widest bg-white border border-slate-200 rounded-xl px-4 py-2.5 outline-none cursor-pointer focus:border-blue-500"
                          defaultValue={`${order.orderStatus}|${order.paymentStatus}`}
                        >
                          <option value="pending|pending">Pending</option>
                          <option value="processing|pending">Processing</option>
                          <option value="shipped|paid">Shipped</option>
                          <option value="delivered|paid">Delivered</option>
                          <option value="cancelled|failed">Cancel</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredOrders.length === 0 && (
          <div className="bg-white rounded-[2.5rem] py-32 text-center border-2 border-dashed border-slate-100">
            <FiShoppingBag className="w-16 h-16 mx-auto text-slate-200 mb-6" />
            <h3 className="text-xl font-bold text-slate-800 tracking-tight">No Order Records</h3>
            <p className="text-sm font-medium text-slate-400 mt-2">The system currently has no data matching these filters</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
