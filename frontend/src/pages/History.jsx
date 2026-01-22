import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  Download, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Filter, 
  Calendar 
} from "lucide-react";
import Layout from "../components/Layout";
import StockService from "../services/stock.service";

const History = () => {
  const [movements, setMovements] = useState([]);
  const [filteredMovements, setFilteredMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Client-side search logic
    const results = movements.filter(m => 
      m.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.location_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.user_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMovements(results);
  }, [searchTerm, movements]);

  const loadData = async () => {
    try {
      const res = await StockService.getMovements();
      setMovements(res.data);
      setFilteredMovements(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      <div className="flex flex-col">
        <span className="font-medium text-slate-900">
          {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </span>
        <span className="text-xs text-slate-500">
          {date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    );
  };

  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="space-y-6"
      >
        {/* Page Header with Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Audit Log</h2>
            <p className="text-slate-500 mt-1">Track every stock movement in real-time.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium shadow-sm">
              <Download size={16} className="mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by product, location, or user..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-slate-700"
            />
          </div>
          <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-indigo-50 rounded-lg transition-colors">
            <Filter size={20} />
          </button>
        </div>

        {/* Modern Table */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Transaction Date</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Details</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4 text-right">Operator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-400">Loading audit trail...</td></tr>
              ) : filteredMovements.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-400">No matching records found.</td></tr>
              ) : (
                filteredMovements.map((m, index) => (
                  <motion.tr 
                    key={m.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-50 transition-colors group"
                  >
                    {/* Date */}
                    <td className="px-6 py-4">
                      {formatDate(m.created_at)}
                    </td>
                    
                    {/* Visual Badge */}
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${
                        m.movement_type === 'IN' 
                          ? 'bg-emerald-700 text-white' 
                          : 'bg-red-500 text-white'
                      }`}>
                        {m.movement_type === 'IN' ? <ArrowDownLeft size={14} className="mr-1" /> : <ArrowUpRight size={14} className="mr-1" />}
                        {m.movement_type === 'IN' ? 'Received' : 'Shipped'}
                      </div>
                    </td>

                    {/* Product & Location */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">{m.product_name}</span>
                        <span className="text-xs text-slate-500 flex items-center mt-0.5">
                          In: {m.location_name}
                        </span>
                      </div>
                    </td>

                    {/* Quantity */}
                    <td className="px-6 py-4 font-mono font-medium text-slate-700">
                      {m.quantity} <span className="text-slate-400 text-xs">units</span>
                    </td>
                    
                    {/* User */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-6 h-6 rounded-full bg-transparent border border-slate-200 text-blue-600 flex items-center justify-center text-xs font-bold">
                          {m.user_name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm text-slate-600">{m.user_name}</span>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </Layout>
  );
};

export default History;