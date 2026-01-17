import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthService from "../services/auth.service";

const Layout = ({ children, title }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    AuthService.logout();
    navigate("/");
  };

  // Helper to highlight active link
  const navClass = (path) =>
    `block px-4 py-2 rounded transition ${
      location.pathname === path
        ? "bg-gray-900 text-white"
        : "text-gray-300 hover:bg-gray-700 hover:text-white"
    }`;

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="h-16 flex items-center justify-center text-xl font-bold border-b border-gray-700">
          WMS System
        </div>
        
        <nav className="flex-1 px-2 py-4 space-y-2">
          <Link to="/dashboard" className={navClass("/dashboard")}>
             Dashboard
          </Link>
          <Link to="/inventory" className={navClass("/inventory")}>
             Inventory
          </Link>
          <Link to="/stock" className={navClass("/stock")}>
             Stock Operations
          </Link>
          <Link to="/warehouses" className={navClass("/warehouses")}>
            Infrastructure
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-sm text-red-200 bg-red-900 rounded hover:bg-red-800"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white shadow flex items-center px-6 justify-between">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <div className="text-sm text-gray-500">Welcome, User</div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;