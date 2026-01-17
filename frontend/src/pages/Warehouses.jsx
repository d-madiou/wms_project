import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import WarehouseService from "../services/warehouse.service";

const Warehouses = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState(null);

  const [newWarehouseName, setNewWarehouseName] = useState("");
  const [newLocationName, setNewLocationName] = useState("");

  useEffect(() => {
    loadWarehouses();
    loadLocations();
  }, []);

  const loadWarehouses = () => {
    WarehouseService.getWarehouses().then((res) => setWarehouses(res.data));
  };

  const loadLocations = () => {
    WarehouseService.getLocations().then((res) => setLocations(res.data));
  };


  const handleCreateWarehouse = async (e) => {
    e.preventDefault();
    try {
      await WarehouseService.createWarehouse({ 
        name: newWarehouseName,
        address: "N/A"
      });
      setNewWarehouseName("");
      loadWarehouses();
    } catch (err) {
      alert("Failed to create warehouse");
    }
  };

  const handleCreateLocation = async (e) => {
    e.preventDefault();
    if (!selectedWarehouseId) return alert("Select a warehouse first!");
    
    try {
      await WarehouseService.createLocation({
        warehouse: selectedWarehouseId,
        name: newLocationName,
        barcode: newLocationName.toUpperCase() + "-BAR",
        is_receiving_area: false,
        is_shipping_area: false
      });
      setNewLocationName("");
      loadLocations();
    } catch (err) {
      alert("Failed to create location");
    }
  };

 
  const activeLocations = locations.filter(l => l.warehouse === selectedWarehouseId);

  return (
    <Layout title="Infrastructure Management">
      <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-150px)]">
        
        <div className="w-full md:w-1/3 bg-white rounded-lg shadow p-4 flex flex-col">
          <h3 className="font-bold text-lg mb-4 text-gray-700">🏢 Warehouses</h3>
          
          <form onSubmit={handleCreateWarehouse} className="mb-4 flex gap-2">
            <input 
              className="border p-2 rounded flex-1 text-sm"
              placeholder="New Warehouse Name..."
              value={newWarehouseName}
              onChange={(e) => setNewWarehouseName(e.target.value)}
              required
            />
            <button className="bg-blue-600 text-white px-3 rounded">+</button>
          </form>

          {/* List */}
          <div className="overflow-y-auto flex-1 space-y-2">
            {warehouses.map(w => (
              <div 
                key={w.id}
                onClick={() => setSelectedWarehouseId(w.id)}
                className={`p-3 rounded cursor-pointer border transition ${
                  selectedWarehouseId === w.id 
                    ? "bg-blue-50 border-blue-500 shadow-sm" 
                    : "hover:bg-gray-50 border-transparent"
                }`}
              >
                <div className="font-medium text-gray-800">{w.name}</div>
                <div className="text-xs text-gray-500">ID: {w.id}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full md:w-2/3 bg-white rounded-lg shadow p-4 flex flex-col">
          <h3 className="font-bold text-lg mb-4 text-gray-700">📍 Locations (Bins/Shelves)</h3>

          {!selectedWarehouseId ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 italic">
              Select a warehouse to manage locations
            </div>
          ) : (
            <>
              <div className="mb-2 text-sm text-blue-600 font-semibold">
                Managing: {warehouses.find(w => w.id === selectedWarehouseId)?.name}
              </div>

              <form onSubmit={handleCreateLocation} className="mb-6 bg-gray-50 p-3 rounded border flex gap-4 items-center">
                <input 
                  className="border p-2 rounded flex-1 text-sm"
                  placeholder="New Location Name (e.g. Shelf A-1)..."
                  value={newLocationName}
                  onChange={(e) => setNewLocationName(e.target.value)}
                  required
                />
                <button className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">
                  Add Location
                </button>
              </form>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 overflow-y-auto">
                {activeLocations.length === 0 && (
                  <p className="text-gray-400 text-sm">No locations yet.</p>
                )}
                {activeLocations.map(l => (
                  <div key={l.id} className="border rounded p-3 text-center hover:shadow-md transition bg-white">
                    <div className="font-bold text-gray-800">{l.name}</div>
                    <div className="text-xs text-gray-400 font-mono mt-1">{l.barcode}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

      </div>
    </Layout>
  );
};

export default Warehouses;