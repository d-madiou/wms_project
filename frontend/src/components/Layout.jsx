import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // Animation library
import { 
  LayoutDashboard, 
  Package, 
  ArrowRightLeft, 
  Warehouse, 
  History, 
  LogOut, 
  Menu, 
  X,
  ChevronRight
} from "lucide-react"; // Beautiful icons
import AuthService from "../services/auth.service";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const username = localStorage.getItem("user_name") || "User";
  const userRole = localStorage.getItem("user_role") || "Guest";

  const handleLogout = () => {
    AuthService.logout();
    navigate("/");
  };

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Inventory", path: "/inventory", icon: Package },
    { label: "Operations", path: "/stock", icon: ArrowRightLeft },
    { label: "Warehouses", path: "/warehouses", icon: Warehouse },
    { label: "Audit Log", path: "/history", icon: History },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-white shadow-xl">
      {/* Brand */}
      <div className="h-20 flex items-center px-8 border-b border-slate-800">
        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-indigo-500/20">
          <span className="font-bold text-white text-lg">H</span>
        </div>
        <span className="text-xl font-bold tracking-tight">The House</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                isActive 
                  ? "bg-blue-600 text-white shadow-md shadow-indigo-900/20" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <item.icon size={20} className={`mr-3 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
              {item.label}
              {isActive && (
                <motion.div 
                  layoutId="activeIndicator"
                  className="absolute right-0 w-1 h-8 bg-indigo-400 rounded-l-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center mb-4 px-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-orange-500 flex items-center justify-center text-white font-bold">
            {username.charAt(0).toUpperCase()}
          </div>
          <div className="ml-3">
            <p className="text-sm font-semibold text-white">{username}</p>
            <p className="text-xs text-slate-500 capitalize">{userRole}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-900/10 rounded-lg transition-colors"
        >
          <LogOut size={16} className="mr-2" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200">
          <span className="font-bold text-slate-800">The House</span>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600">
            <Menu size={24} />
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-8 relative">
           {/* Background decoration */}
           <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-indigo-50 to-slate-50 -z-10" />
           {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;