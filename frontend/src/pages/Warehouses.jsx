import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import WarehouseService from "../services/warehouse.service";

const Warehouses = () => {
  const [locations, setLocations] = useState([]);
  
  const userRole = localStorage.getItem("user_role");
  const canEdit = ["admin", "manager"].includes(userRole);

  useEffect(() => {
    WarehouseService.getAllLocations()
      .then(res => setLocations(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <Layout>
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Warehouses & Locations</h2>
          <p className="text-gray-500 text-sm mt-1">Physical structure setup.</p>
        </div>
        
        {canEdit && (
          <button 
             className="bg-blue-600 text-white px-5 py-2 text-sm font-medium rounded hover:bg-blue-700 transition-colors"
             onClick={() => alert("Open Add Warehouse Modal")}
          >
            + Add Location
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {locations.map((loc) => (
          <div key={loc.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-gray-800 mb-1">{loc.name}</h3>
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-4">Code: {loc.code}</p>
            <div className="border-t border-gray-100 pt-3 flex justify-between items-center text-sm">
              <span className="text-gray-600">Warehouse:</span>
              <span className="font-medium text-gray-900">{loc.warehouse_name || "General"}</span>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Warehouses;