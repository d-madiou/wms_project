import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Stock from "./pages/Stock";
import Warehouses from "./pages/Warehouses";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/warehouses" element={<Warehouses />} />
      </Routes>
    </Router>
  );
}

export default App;