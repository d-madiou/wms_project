import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; 
import Layout from "../components/Layout";

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_products: 0,
    total_stock_quantity: 0,
    low_stock_count: 0,
    recent_activity: [] 
  });
  const [loading, setLoading] = useState(true);
  const userRole = localStorage.getItem("user_role");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get("http://localhost:8000/api/dashboard/stats/", {
        headers: {
            "Authorization": `Bearer ${token}`
        }
      });

      setStats(response.data);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
        <p className="text-gray-500 text-sm mt-1">
          Welcome back. Here is what's happening in your warehouse today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
        
        {/* Metric Card 1: Total Products */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-blue-500 p-6">
          <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">Product Catalog</h3>
          <div className="mt-4 flex items-baseline">
            <span className="text-3xl font-bold text-gray-900">
              {loading ? "-" : stats.total_products}
            </span>
            <span className="ml-2 text-sm text-gray-500">unique SKUs</span>
          </div>
        </div>
        
        {/* Metric Card 2: Total Physical Stock */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-green-500 p-6">
          <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Inventory On Hand</h3>
          <div className="mt-4 flex items-baseline">
            <span className="text-3xl font-bold text-gray-900">
              {loading ? "-" : stats.total_stock_quantity}
            </span>
            <span className="ml-2 text-sm text-gray-500">units</span>
          </div>
        </div>

        {/* Metric Card 3: Alerts */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-red-500 p-6">
          <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">Low Stock Alerts</h3>
          <div className="mt-4 flex items-baseline">
            <span className="text-3xl font-bold text-gray-900">
              {loading ? "-" : stats.low_stock_count}
            </span>
            <span className="ml-2 text-sm text-gray-500">locations needs attention</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Recent Activity (Takes up 2/3 width on large screens) */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-700">Recent Movements</h3>
            </div>
            <table className="min-w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-medium">
                    <tr>
                        <th className="px-6 py-3">Action</th>
                        <th className="px-6 py-3">Qty</th>
                        <th className="px-6 py-3">User</th>
                        <th className="px-6 py-3 text-right">Time</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                    {loading ? (
                         <tr><td colSpan="4" className="px-6 py-4 text-center">Loading...</td></tr>
                    ) : stats.recent_activity && stats.recent_activity.length > 0 ? (
                        stats.recent_activity.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-3 font-medium text-gray-800">{item.action}</td>
                                <td className="px-6 py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                        item.action.includes('IN') 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-orange-500 text-black'
                                    }`}>
                                        {item.quantity}
                                    </span>
                                </td>
                                <td className="px-6 py-3 text-gray-600">{item.user}</td>
                                <td className="px-6 py-3 text-right text-gray-400">{item.time}</td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">No activity yet.</td></tr>
                    )}
                </tbody>
            </table>
        </div>

        {/* RIGHT COLUMN: Quick Actions (Takes up 1/3 width) */}
        <div className="lg:col-span-1 bg-white border border-gray-200 rounded-lg shadow-sm p-6 h-fit">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="flex flex-col gap-3">
            
            <Link 
                to="/stock" 
                className="w-full text-center px-4 py-3 bg-blue-50 border border-blue-100 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors"
            >
                 Move Stock (In/Out)
            </Link>

            {/* Only show if Admin/Manager */}
            {['admin', 'manager'].includes(userRole) && (
                <Link 
                to="/inventory" 
                className="w-full text-center px-4 py-3 bg-gray-50 border border-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                 Manage Products
                </Link>
            )}

            <Link 
                to="/history" 
                className="w-full text-center px-4 py-3 bg-gray-50 border border-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
            >
                 View History
            </Link>
            </div>
        </div>

      </div>
    </Layout>
  );
};

export default Dashboard;