import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import InventoryService from "../services/inventory.service";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    barcode: "",
    category: "",
    description: "",
    price: "",
    weight: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        InventoryService.getProducts(),
        InventoryService.getCategories()
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error("Error loading data", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await InventoryService.createProduct(formData);
      alert("Product Created! 🎉");
      setIsModalOpen(false); // Close modal
      setFormData({ name: "", sku: "", barcode: "", category: "", description: "", price: "", weight: "" }); // Reset form
      loadData(); // Refresh list
    } catch (err) {
      console.error(err);
      // NEW: Extract the exact error message from Django
      let errorMsg = "Error creating product.";
      if (err.response && err.response.data) {
        // Django sends errors like { "sku": ["This field must be unique."] }
        // We join them into a readable string
        const details = Object.entries(err.response.data)
          .map(([key, msgs]) => `${key}: ${msgs.join(" ")}`)
          .join("\n");
        errorMsg += `\n${details}`;
      }
      
      alert(errorMsg);

      
    }
  };

  return (
    <Layout title="Inventory Management">
      
      {/* TOP BAR */}
      <div className="mb-6 flex justify-between items-center">
        <input 
          type="text" 
          placeholder="Search SKU or Name..." 
          className="px-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition flex items-center gap-2"
        >
          <span>+</span> Add Product
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Barcode</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700">{product.sku}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 bg-blue-50 rounded-full px-2 inline-block mt-2">{product.category_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{product.barcode}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${product.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MODAL (POPUP) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/25 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="text-xl font-bold text-gray-800">New Product</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Row 1 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">SKU *</label>
                  <input name="sku" required value={formData.sku} onChange={handleInputChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="E.g. ITEM-001" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Barcode *</label>
                  <input name="barcode" required value={formData.barcode} onChange={handleInputChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Scan or Type" />
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Product Name *</label>
                <input name="name" required value={formData.name} onChange={handleInputChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Category *</label>
                <select name="category" required value={formData.category} onChange={handleInputChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">Select Category...</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {categories.length === 0 && <p className="text-xs text-red-500 mt-1">No categories found! Add one in Admin.</p>}
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                  <input name="price" type="number" step="0.01" value={formData.price} onChange={handleInputChange} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                  <input name="weight" type="number" step="0.01" value={formData.weight} onChange={handleInputChange} className="w-full border p-2 rounded" />
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save Product</button>
              </div>

            </form>
          </div>
        </div>
      )}

    </Layout>
  );
};

export default Inventory;