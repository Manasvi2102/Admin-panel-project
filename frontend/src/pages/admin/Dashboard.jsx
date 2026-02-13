import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import AdminLayout from '../../components/admin/AdminLayout';
import { FiBook, FiShoppingBag, FiUsers, FiDollarSign, FiTrendingUp, FiAlertTriangle } from 'react-icons/fi';
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
      setError('Failed to fetch dashboard stats');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message={error || 'Failed to load dashboard'} />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Books',
      value: stats.overview.totalBooks,
      icon: FiBook,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Orders',
      value: stats.overview.totalOrders,
      icon: FiShoppingBag,
      color: 'bg-green-500',
    },
    {
      title: 'Total Revenue',
      value: `$${stats.overview.totalRevenue.toFixed(2)}`,
      icon: FiDollarSign,
      color: 'bg-yellow-500',
    },
    {
      title: 'Total Users',
      value: stats.overview.totalUsers,
      icon: FiUsers,
      color: 'bg-purple-500',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-full text-white`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Low Stock Alert */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <FiAlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
                <h2 className="text-xl font-bold">Low Stock Alert</h2>
              </div>
              {stats.lowStockBooks && stats.lowStockBooks.length > 0 ? (
                <div className="space-y-2">
                  {stats.lowStockBooks.map((book) => (
                    <div key={book._id} className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                      <span className="font-medium">{book.title}</span>
                      <span className="text-red-600 font-semibold">Stock: {book.stock}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">All books have sufficient stock</p>
              )}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
              {stats.recentOrders && stats.recentOrders.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentOrders.map((order) => (
                    <div key={order._id} className="border-b pb-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">Order #{order._id.slice(-8)}</p>
                          <p className="text-sm text-gray-600">{order.user?.name || 'Unknown'}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${order.total.toFixed(2)}</p>
                          <p className="text-sm text-gray-600 capitalize">{order.orderStatus}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No recent orders</p>
              )}
            </div>
          </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;

