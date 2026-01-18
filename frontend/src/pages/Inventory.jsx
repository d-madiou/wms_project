import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import InventoryService from "../services/inventory.service";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Role Check
  const userRole = localStorage.getItem("user_role");
  const canEdit = ["admin", "manager"].includes(userRole);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await InventoryService.getAllProducts();
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Inventory</h2>
          <p className="text-gray-500 text-sm mt-1">Manage your product catalog.</p>
        </div>
        
        {/* RBAC: Only show button if Admin/Manager */}
        {canEdit && (
          <button 
            className="bg-blue-600 text-white px-5 py-2 text-sm font-medium rounded hover:bg-blue-700 transition-colors"
            onClick={() => alert("Open Modal Here")} // You can reconnect your modal logic
          >
            + Add Product
          </button>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">SKU</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4 text-right">Stock Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading data...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No products found.</td></tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-gray-600">{p.sku}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                  <td className="px-6 py-4 text-gray-600">{p.category?.name || "-"}</td>
                  <td className="px-6 py-4 text-gray-900">${p.price}</td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900">
                     {/* We will calculate real stock later, for now placeholder or API data */}
                     - 
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default Inventory;