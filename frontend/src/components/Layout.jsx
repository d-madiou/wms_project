import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthService from "../services/auth.service";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const userRole = localStorage.getItem("user_role") || "guest";
  const username = localStorage.getItem("user_name") || "User";

  const handleLogout = () => {
    AuthService.logout();
    navigate("/");
  };

  const navItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Inventory", path: "/inventory" },
    { label: "Stock Operations", path: "/stock" },
    { label: "Warehouses", path: "/warehouses" },
    { label: "History", path: "/history" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between">
        <div>
          <div className="h-16 flex items-center px-6 border-b border-gray-100">
            <h1 className="text-xl font-bold tracking-tight text-gray-800">WMS Project</h1>
          </div>
          
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  location.pathname === item.path
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* User Info Footer */}
        <div className="p-4 border-t border-gray-100">
          <div className="mb-3 px-2">
            <p className="text-sm font-bold text-gray-900">{username}</p>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{userRole}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;