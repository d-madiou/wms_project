import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import StockService from "../services/stock.service";
import InventoryService from "../services/inventory.service";
import WarehouseService from "../services/warehouse.service";

const Stock = () => {
  // --- DATA STATE ---
  const [stockItems, setStockItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);

  // --- UI STATE ---
  const [mode, setMode] = useState("receive"); // Options: "receive" or "ship"
  const [message, setMessage] = useState("");

  // --- FORM STATE ---
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [stockRes, prodRes, locRes] = await Promise.all([
        StockService.getAllStock(),
        InventoryService.getProducts(),
        WarehouseService.getLocations(),
      ]);

      setStockItems(stockRes.data);
      setProducts(prodRes.data);
      setLocations(locRes.data);
    } catch (err) {
      console.error("Error loading data", err);
      setMessage("❌ Failed to load data. Check console.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages

    if (!selectedProduct || !selectedLocation || !quantity) {
      setMessage("⚠️ Please fill in all fields.");
      return;
    }

    try {
      const payload = {
        product: selectedProduct,
        location: selectedLocation,
        quantity: parseInt(quantity),
      };

      if (mode === "receive") {
        // INBOUND LOGIC
        await StockService.addStock(payload);
        setMessage("Stock Received successfully! ✅");
      } else {
        // OUTBOUND LOGIC
        await StockService.shipStock(payload);
        setMessage("Stock Shipped successfully! 📦");
      }

      setQuantity(""); // Reset quantity input
      loadData(); // Refresh the table to show new numbers
    } catch (err) {
      console.error(err);
      // Extract error message from backend if available
      const errorMsg = err.response?.data?.error || "Operation failed.";
      setMessage(`❌ ${errorMsg}`);
    }
  };

  return (
    <Layout title="Stock Operations">
      
      <div className="max-w-4xl mx-auto">
        
        {/* --- MODE TOGGLE BUTTONS --- */}
        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => { setMode("receive"); setMessage(""); }}
            className={`flex-1 py-4 rounded-lg font-bold text-lg transition shadow-sm ${
              mode === "receive" 
                ? "bg-green-600 text-white shadow-lg ring-4 ring-green-100 transform -translate-y-1" 
                : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
          >
            📥 INBOUND (Receive)
          </button>
          <button 
            onClick={() => { setMode("ship"); setMessage(""); }}
            className={`flex-1 py-4 rounded-lg font-bold text-lg transition shadow-sm ${
              mode === "ship" 
                ? "bg-red-600 text-white shadow-lg ring-4 ring-red-100 transform -translate-y-1" 
                : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
          >
            📤 OUTBOUND (Ship)
          </button>
        </div>

        {/* --- OPERATION FORM --- */}
        <div className="bg-white p-8 rounded-lg shadow-md mb-8 border border-gray-100">
          <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${
            mode === "receive" ? "text-green-700" : "text-red-700"
          }`}>
            {mode === "receive" ? "📥 Receive Stock into Warehouse" : "📤 Ship Stock to Customer"}
          </h3>
          
          {message && (
            <div className={`mb-6 p-4 rounded text-sm font-medium ${
              message.includes("❌") ? "bg-red-50 text-red-700" : 
              message.includes("⚠️") ? "bg-yellow-50 text-yellow-700" :
              "bg-green-50 text-green-700"
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Product Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
                <select 
                  className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition" 
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  required
                >
                  <option value="">Select Product...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                  ))}
                </select>
              </div>

              {/* Location Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select 
                  className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  required
                >
                  <option value="">Select Location...</option>
                  {locations.map(l => (
                    <option key={l.id} value={l.id}>{l.name} ({l.warehouse_name})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quantity Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <input 
                type="number" 
                className="w-full md:w-1/3 border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
                placeholder="0"
                required
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className={`w-full py-3 rounded-lg font-bold text-white transition shadow-md hover:shadow-lg ${
                mode === "receive" 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {mode === "receive" ? "Confirm Receipt (+ Stock)" : "Confirm Shipment (- Stock)"}
            </button>
          </form>
        </div>

        {/* --- STOCK TABLE --- */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-bold text-gray-700">Current Inventory Levels</h3>
          </div>
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stockItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.product_details?.name}</div>
                    <div className="text-xs text-gray-500">{item.product_details?.sku}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">
                      {item.location_details?.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-sm font-bold ${
                      item.quantity < 10 ? "text-red-600 bg-red-50" : "text-green-600 bg-green-50"
                    }`}>
                      {item.quantity} units
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.updated_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {stockItems.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500 italic">
                    No stock found in the system.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Stock;