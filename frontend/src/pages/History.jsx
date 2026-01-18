import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import StockService from "../services/stock.service";

const History = () => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await StockService.getMovements();
      setMovements(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Layout>
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Transaction History</h2>
        <p className="text-gray-500 text-sm mt-1">Audit log of all stock movements (Inbound & Outbound).</p>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Date & Time</th>
              <th className="px-6 py-4">Operation</th>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Quantity</th>
              <th className="px-6 py-4 text-right">Performed By</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">Loading history...</td></tr>
            ) : movements.length === 0 ? (
              <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">No transactions found.</td></tr>
            ) : (
              movements.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                  {/* Date */}
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                    {formatDate(m.created_at)}
                  </td>
                  
                  {/* Badge */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      m.movement_type === 'IN' 
                        ? 'bg-green-500 text-white border-white' 
                        : 'bg-red-500 text-white border-white'
                    }`}>
                      {m.movement_type === 'IN' ? 'RECEIVED' : 'SHIPPED'}
                    </span>
                  </td>

                  {/* Details */}
                  <td className="px-6 py-4 font-medium text-gray-900">{m.product_name}</td>
                  <td className="px-6 py-4 text-gray-600">{m.location_name}</td>
                  <td className="px-6 py-4 font-mono font-bold text-gray-800">{m.quantity}</td>
                  
                  {/* User */}
                  <td className="px-6 py-4 text-right text-gray-500">
                    {m.user_name}
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

export default History;