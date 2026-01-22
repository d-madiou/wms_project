import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Warehouse, 
  MapPin, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit2, 
  Trash2,
  FileSpreadsheet,
  X,
  Loader2,
  Save
} from "lucide-react";
import Layout from "../components/Layout";
import WarehouseService from "../services/warehouse.service";

const Warehouses = () => {
  const [locations, setLocations] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    warehouse_id: "",
    capacity: 100
  });

  const userRole = localStorage.getItem("user_role");
  const canEdit = ["admin", "manager"].includes(userRole);

 
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const results = locations.filter(loc => 
        (loc.name || "").toLowerCase().includes(term) ||
        (loc.code || "").toLowerCase().includes(term) ||
        (loc.warehouse_name || "").toLowerCase().includes(term)
    );
    setFilteredLocations(results);
  }, [searchTerm, locations]);

  
  const loadData = async () => {
    try {
      const [locRes, warRes] = await Promise.all([
        WarehouseService.getAllLocations(),
        WarehouseService.getAllWarehouses()
      ]);
      
      
      const sanitizedData = locRes.data.map(item => ({
        ...item,
        name: item.name || "Unnamed Location",
        code: item.code || "---",              
        warehouse_name: item.warehouse_name || "Unassigned",
        current_stock: item.current_stock || 0, 
        capacity: item.capacity || 100 
      }));

      setLocations(sanitizedData);
      setFilteredLocations(sanitizedData);
      setWarehouses(warRes.data || []);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
        setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this location?")) {
      try {
        await WarehouseService.deleteLocation(id);
        setLocations(prev => prev.filter(loc => loc.id !== id));
      } catch (err) {
        alert("Failed to delete. Please try again.");
      }
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
        const res = await WarehouseService.createLocation(formData);
        
        
        const newItem = {
            ...res.data,
            warehouse_name: warehouses.find(w => w.id == formData.warehouse_id)?.name || "New",
            current_stock: 0
        };
        
        setLocations([...locations, newItem]);
        setIsModalOpen(false); 
        resetForm();
    } catch (err) {
        console.error(err);
        alert("Failed to create location. Check your inputs.");
    } finally {
        setIsSubmitting(false);
    }
  };


  const resetForm = () => {
      setFormData({ name: "", code: "", warehouse_id: "", capacity: 100 });
  };

  const getStatus = (current, max) => {
    if (current === 0) return { text: "Empty", style: "bg-slate-100 text-slate-600" };
    if (current >= max) return { text: "Full", style: "bg-red-100 text-red-700" };
    const pct = (current / max) * 100;
    if (pct > 80) return { text: "Critical", style: "bg-orange-100 text-orange-700" };
    return { text: "Available", style: "bg-emerald-100 text-emerald-700" };
  };

  return (
    <Layout>
      <div className="space-y-6 relative">
        
       
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Inventory Locations</h2>
            <p className="text-slate-500 mt-1 text-sm">Manage zones, aisles, and bin capacities.</p>
          </div>
          
          {canEdit && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center px-4 py-2.5 bg-orange-600 text-white rounded-lg font-bold shadow-md shadow-orange-600/20 hover:bg-orange-700 transition-all text-sm"
            >
              <Plus size={18} className="mr-2" />
              Add Location
            </button>
          )}
        </div>

       
        <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-2">
            <div className="relative flex-grow">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search by name, code, or warehouse..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-transparent outline-none text-sm text-slate-700 placeholder-slate-400"
                />
            </div>
            <div className="h-8 w-px bg-slate-200 hidden sm:block mx-2 self-center"></div>
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                <FileSpreadsheet size={16} />
                <span>Export CSV</span>
            </button>
        </div>

       
        {loading ? (
             <div className="text-center py-24">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-3"></div>
                <span className="text-slate-400 text-sm">Loading data...</span>
             </div>
        ) : filteredLocations.length === 0 ? (
             <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <p className="text-slate-500 font-medium">No locations found matching your search.</p>
             </div>
        ) : (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase text-slate-500 tracking-wider">
                                <th className="px-6 py-4">Location Name</th>
                                <th className="px-6 py-4">Code</th>
                                <th className="px-6 py-4">Warehouse</th>
                                <th className="px-6 py-4">Capacity</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredLocations.map((loc, index) => {
                                const status = getStatus(loc.current_stock, loc.capacity);
                                const pct = Math.min(100, Math.round((loc.current_stock / loc.capacity) * 100));

                                return (
                                    <motion.tr 
                                        key={loc.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.03 }}
                                        className="hover:bg-blue-50/50 transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-slate-900 block">{loc.name}</span>
                                        </td>
                                        
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="bg-slate-100 border border-slate-200 text-slate-600 font-mono text-xs px-2 py-1 rounded">
                                                    {loc.code} 
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-slate-500 text-sm">
                                                <Warehouse size={14} className="text-slate-400" />
                                                {loc.warehouse_name || "Unassigned"}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 w-64">
                                            <div className="flex items-center justify-between text-xs mb-1.5">
                                                <span className="text-slate-600 font-medium">{loc.current_stock} <span className="text-slate-400 font-normal">/ {loc.capacity}</span></span>
                                                <span className="text-slate-400">{pct}%</span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full transition-all duration-500 ${
                                                        pct > 90 ? 'bg-red-500' : pct > 70 ? 'bg-orange-500' : 'bg-blue-600'
                                                    }`} 
                                                    style={{ width: `${pct}%` }} 
                                                />
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.style}`}>
                                                {status.text}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {canEdit && (
                                                    <>
                                                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button onClick={() => handleDelete(loc.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </>
                                                )}
                                                <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                                                    <MoreHorizontal size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

      
        <AnimatePresence>
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsModalOpen(false)}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />
                    
                    
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden"
                    >
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-lg text-slate-800">Add New Location</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleCreate} className="p-6 space-y-4">
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="e.g. Zone A-1"
                                        className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Code</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="e.g. ZN-A1"
                                        className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                        value={formData.code}
                                        onChange={(e) => setFormData({...formData, code: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Parent Warehouse</label>
                                <select 
                                    required
                                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                                    value={formData.warehouse_id}
                                    onChange={(e) => setFormData({...formData, warehouse_id: e.target.value})}
                                >
                                    <option value="" disabled>Select a Warehouse</option>
                                    {warehouses.map(w => (
                                        <option key={w.id} value={w.id}>{w.name} ({w.code})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Max Capacity (Items)</label>
                                <input 
                                    type="number" 
                                    required
                                    min="1"
                                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    value={formData.capacity}
                                    onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                    Save Location
                                </button>
                            </div>

                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

      </div>
    </Layout>
  );
};

export default Warehouses;