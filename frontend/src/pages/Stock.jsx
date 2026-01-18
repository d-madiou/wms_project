import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import StockService from "../services/stock.service";
import InventoryService from "../services/inventory.service";
import WarehouseService from "../services/warehouse.service";

const Stock = () => {
  const [stockItems, setStockItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  
  // Form State
  const [movementType, setMovementType] = useState("IN"); 
  const [formData, setFormData] = useState({ product: "", location: "", quantity: 0 });

  const userRole = localStorage.getItem("user_role");
  const canOperate = ["admin", "manager", "operator"].includes(userRole);

  useEffect(() => {
    // 1. Load everything in parallel
    const initData = async () => {
        try {
            const [sRes, pRes, lRes] = await Promise.all([
                StockService.getStockItems(),
                InventoryService.getAllProducts(),
                WarehouseService.getAllLocations()
            ]);
            setStockItems(sRes.data);
            setProducts(pRes.data);
            setLocations(lRes.data);
        } catch (err) {
            console.error("Error loading stock data:", err);
        }
    };
    initData();
  }, []);

  // --- HELPER FUNCTIONS TO FIND NAMES ---
  const getProductName = (idOrObj) => {
    // If backend sends an object: { id: 1, name: 'iPhone' }
    if (typeof idOrObj === 'object' && idOrObj !== null) return idOrObj.name;
    // If backend sends an ID: 1
    const p = products.find(prod => prod.id === idOrObj);
    return p ? p.name : `Product #${idOrObj}`;
  };

  const getProductSku = (idOrObj) => {
    if (typeof idOrObj === 'object' && idOrObj !== null) return idOrObj.sku;
    const p = products.find(prod => prod.id === idOrObj);
    return p ? p.sku : "-";
  };

  const getLocationName = (idOrObj) => {
    if (typeof idOrObj === 'object' && idOrObj !== null) return idOrObj.name;
    const l = locations.find(loc => loc.id === idOrObj);
    return l ? `${l.name} (${l.warehouse_name || 'Whse'})` : `Loc #${idOrObj}`;
  };

  // --- SUBMIT HANDLER ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (movementType === "IN") {
        await StockService.receiveStock(formData);
      } else {
        await StockService.shipStock(formData);
      }
      alert("Operation Successful");
      // Refresh only stock items
      const res = await StockService.getStockItems();
      setStockItems(res.data);
      setFormData({ product: "", location: "", quantity: 0 });
    } catch (err) {
      alert("Operation Failed: " + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Stock Operations</h2>
        <p className="text-gray-500 text-sm mt-1">Track current stock levels {canOperate && "and move inventory"}.</p>
      </div>

      {/* --- OPERATION FORM --- */}
      {canOperate && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
           {/* ... Same Form Code as before ... */}
           {/* For brevity, I am keeping the JSX structure the same, just ensure inputs use formData */}
           <div className="flex space-x-6 mb-6 border-b border-gray-100 pb-4">
            <button 
              className={`pb-2 text-sm font-bold border-b-2 transition-colors ${movementType === 'IN' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              onClick={() => setMovementType("IN")}
            >
              RECEIVE (Inbound)
            </button>
            <button 
              className={`pb-2 text-sm font-bold border-b-2 transition-colors ${movementType === 'OUT' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              onClick={() => setMovementType("OUT")}
            >
              SHIP (Outbound)
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Product</label>
              <select 
                className="w-full border-gray-300 border p-2 rounded text-sm"
                value={formData.product}
                onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                required
              >
                <option value="">Select Product...</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Location</label>
              <select 
                className="w-full border-gray-300 border p-2 rounded text-sm"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              >
                <option value="">Select Location...</option>
                {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Quantity</label>
              <input 
                type="number" min="1"
                className="w-full border-gray-300 border p-2 rounded text-sm"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                required 
              />
            </div>
            <button 
              type="submit"
              className={`h-10 px-6 rounded text-sm font-bold text-white transition-colors ${
                movementType === "IN" ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"
              }`}
            >
              CONFIRM {movementType}
            </button>
          </form>
        </div>
      )}

      {/* --- STOCK TABLE --- */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Product Name</th>
              <th className="px-6 py-4">SKU</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4 text-right">Quantity On Hand</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {stockItems.length === 0 ? (
               <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">Inventory is empty.</td></tr>
            ) : (
              stockItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  {/* USE HELPERS HERE to handle both IDs and Objects */}
                  <td className="px-6 py-4 font-medium text-gray-900">
                      {item.product_name || getProductName(item.product)}
                  </td>
                  <td className="px-6 py-4 font-mono text-gray-500">
                      {item.product_sku || getProductSku(item.product)}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                      {item.location_name || getLocationName(item.location)}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-gray-900">{item.quantity}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default Stock;