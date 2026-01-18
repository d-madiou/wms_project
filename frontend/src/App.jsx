import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard.jsx";
import Inventory from "./pages/Inventory";
import Stock from "./pages/Stock";
import Warehouses from "./pages/Warehouses";
import History from "./pages/History";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/warehouses" element={<Warehouses />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  );
}

export default App;