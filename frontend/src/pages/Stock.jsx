import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Box, 
  MapPin, 
  Layers, 
  CheckCircle,
  AlertTriangle,
  Search
} from "lucide-react";
import Layout from "../components/Layout";
import StockService from "../services/stock.service";
import InventoryService from "../services/inventory.service";
import WarehouseService from "../services/warehouse.service";

const Stock = () => {
  const [stockItems, setStockItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Form State
  const [movementType, setMovementType] = useState("IN"); 
  const [formData, setFormData] = useState({ product: "", location: "", quantity: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userRole = localStorage.getItem("user_role");
  const canOperate = ["admin", "manager", "operator"].includes(userRole);

  useEffect(() => {
    initData();
  }, []);

  useEffect(() => {
    // Client-side filtering
    const lowerSearch = searchTerm.toLowerCase();
    const results = stockItems.filter(item => {
        const pName = (item.product_name || getProductName(item.product)).toLowerCase();
        const lName = (item.location_name || getLocationName(item.location)).toLowerCase();
        return pName.includes(lowerSearch) || lName.includes(lowerSearch);
    });
    setFilteredItems(results);
  }, [searchTerm, stockItems]);

  const initData = async () => {
      try {
          const [sRes, pRes, lRes] = await Promise.all([
              StockService.getStockItems(),
              InventoryService.getAllProducts(),
              WarehouseService.getAllLocations()
          ]);
          setStockItems(sRes.data);
          setFilteredItems(sRes.data);
          setProducts(pRes.data);
          setLocations(lRes.data);
      } catch (err) {
          console.error("Error loading stock data:", err);
      }
  };

  // --- HELPER FUNCTIONS ---
  const getProductName = (idOrObj) => {
    if (typeof idOrObj === 'object' && idOrObj !== null) return idOrObj.name;
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
    return l ? l.name : `Loc #${idOrObj}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        quantity: parseInt(formData.quantity)
      };

      if (movementType === "IN") {
        await StockService.receiveStock(payload);
      } else {
        await StockService.shipStock(payload);
      }
      
      
      const res = await StockService.getStockItems();
      setStockItems(res.data);
      setFilteredItems(res.data);
      setFormData({ product: "", location: "", quantity: "" });
      alert("Operation Successful!"); 
    } catch (err) {
      alert("Operation Failed: " + (err.response?.data?.detail || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Stock Operations</h2>
          <p className="text-slate-500 mt-1">Real-time inventory control and movements.</p>
        </div>

        {/* --- OPERATION CARD (The "Command Center") --- */}
        {canOperate && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
          >
             {/* Toggle Switch */}
             <div className="flex border-b border-slate-100">
                <button 
                  onClick={() => setMovementType("IN")}
                  className={`flex-1 py-4 text-sm font-bold flex items-center justify-center transition-all ${
                    movementType === 'IN' 
                    ? 'bg-orange-600 text-white border-b-2 border-orange-500' 
                    : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <ArrowDownCircle className="mr-2" size={18} />
                  RECEIVE STOCK
                </button>
                <button 
                  onClick={() => setMovementType("OUT")}
                  className={`flex-1 py-4 text-sm font-bold flex items-center justify-center transition-all ${
                    movementType === 'OUT' 
                    ? 'bg-red-500 text-white border-b-2 border-white' 
                    : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <ArrowUpCircle className="mr-2" size={18} />
                  SHIP STOCK
                </button>
             </div>

             {/* Form Area */}
             <div className={`p-6 transition-colors duration-500 ${movementType === 'IN' ? 'bg-emerald-50/30' : 'bg-amber-50/30'}`}>
               <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
                  {/* Product Select */}
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 ml-1">Select Product</label>
                    <div className="relative">
                        <Box className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <select 
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none"
                          value={formData.product}
                          onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                          required
                        >
                          <option value="">Choose item...</option>
                          {products.map(p => <option key={p.id} value={p.id}>{p.name} — {p.sku}</option>)}
                        </select>
                    </div>
                  </div>

                  {/* Location Select */}
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 ml-1">Target Location</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <select 
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          required
                        >
                          <option value="">Choose zone/bin...</option>
                          {locations.map(l => <option key={l.id} value={l.id}>{l.name} ({l.warehouse_name})</option>)}
                        </select>
                    </div>
                  </div>

                  {/* Quantity Input */}
                  <div className="w-full md:w-32">
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 ml-1">Quantity</label>
                    <div className="relative">
                        <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="number" min="1"
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          placeholder="00"
                          value={formData.quantity}
                          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                          required 
                        />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full md:w-auto px-6 py-2.5 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center ${
                      movementType === "IN" 
                      ? "bg-orange-600 hover:bg-orange-700" 
                      : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {isSubmitting ? "Processing..." : (
                        <>
                            <CheckCircle size={18} className="mr-2" />
                            Confirm
                        </>
                    )}
                  </button>
               </form>
             </div>
          </motion.div>
        )}

        {/* --- STOCK LIST TABLE --- */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            {/* Table Search Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-bold text-slate-700">Current Stock Levels</h3>
                <div className="relative w-64">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Filter stock..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-1.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
            </div>

            <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                    <tr>
                    <th className="px-6 py-4">Product Details</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4 text-right">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredItems.length === 0 ? (
                        <tr>
                            <td colSpan="3" className="px-6 py-12 text-center">
                                <div className="flex flex-col items-center justify-center text-slate-400">
                                    <Box size={48} className="mb-3 opacity-20" />
                                    <p>No inventory found.</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                    filteredItems.map((item, index) => {
                        const qty = item.quantity;
                        const isLowStock = qty < 10;
                        
                        return (
                            <motion.tr 
                                key={item.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="hover:bg-slate-50 transition-colors"
                            >
                                <td className="px-6 py-4">
                                    <div>
                                        <div className="font-medium text-slate-900">{item.product_name || getProductName(item.product)}</div>
                                        <div className="text-xs text-slate-500 font-mono mt-0.5">{item.product_sku || getProductSku(item.product)}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                                        <MapPin size={12} className="mr-1" />
                                        {item.location_name || getLocationName(item.location)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className={`inline-flex items-center font-bold text-sm ${isLowStock ? 'text-red-600' : 'text-emerald-600'}`}>
                                        {isLowStock && <AlertTriangle size={14} className="mr-1" />}
                                        {qty} units
                                    </div>
                                </td>
                            </motion.tr>
                        );
                    })
                    )}
                </tbody>
            </table>
        </div>

      </div>
    </Layout>
  );
};

export default Stock;