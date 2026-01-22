import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  Package, 
  Tag, 
  DollarSign, 
  MoreVertical, 
  X,
  Save,
  Barcode
} from "lucide-react";
import Layout from "../components/Layout";
import InventoryService from "../services/inventory.service";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const userRole = localStorage.getItem("user_role");
  const canEdit = ["admin", "manager"].includes(userRole);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const results = products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(results);
  }, [searchTerm, products]);

  const loadData = async () => {
    try {
      // 1. Fetch Products
      const prodRes = await InventoryService.getAllProducts();
      setProducts(prodRes.data);
      setFilteredProducts(prodRes.data);

      // 2. Try to fetch Categories (but don't crash if it fails)
      try {
        const catRes = await InventoryService.getAllCategories();
        setCategories(catRes.data);
      } catch (catErr) {
        console.warn("Could not load categories. Is the backend route created?", catErr);
        // We just leave categories as [] so the app keeps working
      }

    } catch (err) {
      console.error("Critical Error loading inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- HELPER TO RESOLVE NAME ---
  const getCategoryName = (categoryId) => {
    if (!categoryId) return "Uncategorized";
    // If backend sends the whole object
    if (typeof categoryId === 'object') return categoryId.name;
    // If backend sends just the ID
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.name : "Uncategorized";
  };

  const getProductColor = (name) => {
    const colors = ['bg-blue-500 text-white', 'bg-orange-500 text-white', 'bg-green-500 text-white', 'bg-orange-500 text-black', 'bg-teal-100 text-teal-600'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <Layout>
      <div className="space-y-6">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Product Catalog</h1>
            <p className="text-slate-500 mt-1">Manage SKUs, prices, and categories.</p>
          </div>
          
          {canEdit && (
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="flex items-center px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors"
            >
              <Plus size={20} className="mr-2" />
              Add Product
            </motion.button>
          )}
        </div>

        {/* --- SEARCH BAR --- */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
            <Search size={20} className="text-slate-400" />
            <input 
                type="text" 
                placeholder="Search products by Name or SKU..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent border-none focus:ring-0 text-slate-700 placeholder-slate-400 outline-none"
            />
        </div>

        {/* --- PRODUCT GRID --- */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Unit Price</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-400">Loading catalog...</td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-400">No products found.</td></tr>
              ) : (
                filteredProducts.map((p, index) => (
                  <motion.tr 
                    key={p.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${getProductColor(p.name)}`}>
                                {p.name.substring(0,2).toUpperCase()}
                            </div>
                            <span className="font-medium text-slate-900">{p.name}</span>
                        </div>
                    </td>
                    
                    <td className="px-6 py-4">
                        <div className="flex items-center text-slate-500 font-mono text-xs bg-slate-100 px-2 py-1 rounded w-fit">
                            <Barcode size={12} className="mr-2" />
                            {p.sku}
                        </div>
                    </td>

                   
                    <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-500 text-white">
                            {getCategoryName(p.category)}
                        </span>
                    </td>

                    <td className="px-6 py-4 text-slate-700 font-medium">
                        ${p.price}
                    </td>

                    <td className="px-6 py-4 text-right">
                        <button className="text-slate-400 hover:text-indigo-600 transition-colors p-2 rounded-full hover:bg-indigo-50">
                            <MoreVertical size={18} />
                        </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- SLIDE-OVER MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900">New Product</h2>
                <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                 {/* Inputs for Name/SKU/Price (hidden for brevity, they are same as before) ... */}
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                    <div className="relative">
                        <Package size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" placeholder="e.g. Wireless Mouse" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">SKU (Stock Keeping Unit)</label>
                    <div className="relative">
                        <Barcode size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" placeholder="e.g. WM-001-BLK" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Price</label>
                        <div className="relative">
                            <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="number" className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" placeholder="0.00" />
                        </div>
                    </div>
                    {/* --- FIX 2: MAP CATEGORIES IN MODAL --- */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                        <div className="relative">
                            <Tag size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <select className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-white">
                                <option value="">Select Category...</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                {/* Description and buttons ... */}
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <textarea rows="4" className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" placeholder="Product details..."></textarea>
                </div>
              </div>
              
               <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button 
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors"
                >
                    Cancel
                </button>
                <button 
                    className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center"
                    onClick={() => alert("Backend integration coming next!")}
                >
                    <Save size={18} className="mr-2" />
                    Save Product
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default Inventory;