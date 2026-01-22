import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  AlertTriangle, 
  Package, 
  ArrowRight, 
  Clock 
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import Layout from "../components/Layout";

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_products: 0,
    total_stock_quantity: 0,
    low_stock_count: 0,
    recent_activity: []
  });
  const [loading, setLoading] = useState(true);
  const chartData = [
    { name: 'Mon', stock: 120 },
    { name: 'Tue', stock: 132 },
    { name: 'Wed', stock: 101 },
    { name: 'Thu', stock: 134 },
    { name: 'Fri', stock: 190 },
    { name: 'Sat', stock: 230 },
    { name: 'Sun', stock: stats.total_stock_quantity || 210 },
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get("http://localhost:8000/api/dashboard/stats/", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (err) {
      console.error("Dashboard error", err);
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <Layout>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Overview</h1>
            <p className="text-slate-500 mt-1">Real-time insights into warehouse operations.</p>
          </div>
          <Link to="/stock" className="hidden md:flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors shadow-lg shadow-indigo-200">
            <span>New Movement</span>
            <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <motion.div variants={itemVariants} className="bg-blue-500 p-2 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-white">Total Products</p>
              </div>
              {/* <div className="p-3 bg-blue-500 text-white rounded-md">
                <Package size={24} />
              </div> */}
              <h3 className="text-3xl font-bold text-white mt-2">{stats.total_products}</h3>
            </div>
            {/* <div className="mt-4 flex items-center text-sm text-green-600">
              <TrendingUp size={16} className="mr-1" />
              <span className="font-medium">+2.5%</span>
              <span className="text-slate-400 ml-1">from last month</span>
            </div> */}
          </motion.div>

          {/* Card 2 */}
          <motion.div variants={itemVariants} className="bg-orange-500 p-2 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-white">Total Stock</p>
                
              </div>
              {/* <div className="p-3 bg-indigo-50 text-blue-600 rounded-md">
                <TrendingUp size={24} />
              </div> */}
              <h3 className="text-3xl font-bold text-white mt-2">{stats.total_stock_quantity}</h3>
            </div>
            {/* <div className="mt-4 flex items-center text-sm text-white">
              <span>Across all warehouse locations</span>
            </div> */}
          </motion.div>

          {/* Card 3 (Alert) */}
          <motion.div variants={itemVariants} className="bg-red-600 p-2 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden">
            {stats.low_stock_count > 0 && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-red-500 opacity-10 rounded-bl-full -mr-8 -mt-8"></div>
            )}
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-white">Low Stock Alerts</p>
                
              </div>
              {/* <div className={`p-3 rounded-xl ${stats.low_stock_count > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                <AlertTriangle size={24} />
              </div> */}
              <h3 className={`text-3xl font-bold mt-2 ${stats.low_stock_count > 0 ? 'text-white' : 'text-slate-900'}`}>
                    {stats.low_stock_count}
                </h3>
            </div>
             {/* <div className="mt-4 flex items-center text-sm text-slate-400">
              <span>Requires immediate attention</span>
            </div> */}
          </motion.div>
        </div>

        {/* Chart & Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            
            {/* Chart Area */}
            <motion.div variants={itemVariants} className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Inventory Trends</h3>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                            <Tooltip 
                                contentStyle={{backgroundColor: '#fff', borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                cursor={{stroke: '#6366f1', strokeWidth: 1}}
                            />
                            <Area type="monotone" dataKey="stock" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorStock)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Recent Activity List */}
            <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                    {stats.recent_activity.map((item, idx) => (
                        <div key={idx} className="flex items-start pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                            <div className={`mt-1 w-2 h-2 rounded-full ${item.action.includes('IN') ? 'bg-green-500' : 'bg-orange-500'}`} />
                            <div className="ml-4 flex-1">
                                <p className="text-sm font-medium text-slate-800">{item.action}</p>
                                <div className="flex items-center justify-between mt-1">
                                    <span className="text-xs text-slate-400 flex items-center">
                                        <Clock size={12} className="mr-1"/> {item.time}
                                    </span>
                                    <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                                        Qty: {item.quantity}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {stats.recent_activity.length === 0 && (
                        <p className="text-sm text-slate-400 text-center py-4">No recent activity.</p>
                    )}
                </div>
                <Link to="/history" className="block mt-6 text-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                    View Full Audit Log
                </Link>
            </motion.div>

        </div>

      </motion.div>
    </Layout>
  );
};

export default Dashboard;