import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import InventoryService from "../services/inventory.service";

const Dashboard = () => {
  const [stats, setStats] = useState({ products: 0, stock: 0 });

  useEffect(() => {
    // We can fetch real stats later. For now, let's just prove it works.
    InventoryService.getProducts().then((res) => {
      setStats((prev) => ({ ...prev, products: res.data.length }));
    });
  }, []);

  return (
    <Layout title="Dashboard">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Card 1 */}
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-gray-500 text-sm uppercase font-bold">Total Products</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{stats.products}</p>
        </div>
        
        {/* Card 2 */}
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-gray-500 text-sm uppercase font-bold">Pending Orders</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
        </div>

        {/* Card 3 */}
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-gray-500 text-sm uppercase font-bold">Low Stock Alerts</h3>
          <p className="text-3xl font-bold text-red-500 mt-2">0</p>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;