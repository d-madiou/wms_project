import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import InventoryService from "../services/inventory.service";
import StockService from "../services/stock.service";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStockQuantity: 0,
    lowStockCount: 0,
    totalValue: 0,
  });
  const [loading, setLoading] = useState(true);
  const userRole = localStorage.getItem("user_role");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Parallel data fetching for performance
      const [productsRes, stockRes] = await Promise.all([
        InventoryService.getAllProducts(),
        StockService.getStockItems()
      ]);

      const products = productsRes.data;
      const stockItems = stockRes.data;

      // Calculate Metrics
      const totalStock = stockItems.reduce((acc, item) => acc + item.quantity, 0);
      
      // Simple logic: If a stock item has less than 10 units, count as low stock
      const lowStock = stockItems.filter(item => item.quantity < 10).length;

      setStats({
        totalProducts: products.length,
        totalStockQuantity: totalStock,
        lowStockCount: lowStock,
      });
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
              {loading ? "-" : stats.totalProducts}
            </span>
            <span className="ml-2 text-sm text-gray-500">unique SKUs</span>
          </div>
        </div>
        
        {/* Metric Card 2: Total Physical Stock */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-green-500 p-6">
          <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Inventory On Hand</h3>
          <div className="mt-4 flex items-baseline">
            <span className="text-3xl font-bold text-gray-900">
              {loading ? "-" : stats.totalStockQuantity}
            </span>
            <span className="ml-2 text-sm text-gray-500">units</span>
          </div>
        </div>

        {/* Metric Card 3: Alerts */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-red-500 p-6">
          <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">Low Stock Alerts</h3>
          <div className="mt-4 flex items-baseline">
            <span className="text-3xl font-bold text-gray-900">
              {loading ? "-" : stats.lowStockCount}
            </span>
            <span className="ml-2 text-sm text-gray-500">locations needs attention</span>
          </div>
        </div>
      </div>

      {/* Quick Actions / Shortcuts Section */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
        <div className="flex gap-4">
          
          <Link 
            to="/stock" 
            className="px-4 py-2 bg-gray-50 border border-gray-200 text-gray-700 rounded text-sm font-medium hover:bg-gray-100 hover:border-gray-300 transition-colors"
          >
            Check Stock Levels
          </Link>

          {/* Only show if Admin/Manager */}
          {['admin', 'manager'].includes(userRole) && (
            <Link 
              to="/inventory" 
              className="px-4 py-2 bg-gray-50 border border-gray-200 text-gray-700 rounded text-sm font-medium hover:bg-gray-100 hover:border-gray-300 transition-colors"
            >
              Manage Products
            </Link>
          )}

          <Link 
            to="/history" 
            className="px-4 py-2 bg-gray-50 border border-gray-200 text-gray-700 rounded text-sm font-medium hover:bg-gray-100 hover:border-gray-300 transition-colors"
          >
            View Audit Log
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;