import React, { useState } from "react";
import AuthService from "../services/auth.service";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "operator"
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await AuthService.register(
        formData.username, 
        formData.email, 
        formData.password, 
        formData.role
      );
      alert("Registration Successful! Please Login.");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Registration failed. Username might be taken.");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Account</h2>
        
        <form onSubmit={handleRegister} className="space-y-4">
          
          {/* Username */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
            <input 
              name="username"
              className="w-full border p-2 rounded focus:outline-blue-500" 
              onChange={handleChange} 
              required 
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input 
              name="email"
              type="email"
              className="w-full border p-2 rounded focus:outline-blue-500" 
              onChange={handleChange} 
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input 
              name="password"
              type="password" 
              className="w-full border p-2 rounded focus:outline-blue-500" 
              onChange={handleChange} 
              required 
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Select Role</label>
            <select 
              name="role" 
              className="w-full border p-2 rounded bg-white focus:outline-blue-500"
              onChange={handleChange}
              value={formData.role}
            >
              <option value="manager">User Manager (Can create items)</option>
              <option value="operator">Operator (Can move stock)</option>
              <option value="driver">Driver (Read Only)</option>
            </select>
          </div>

          <button className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition">
            Sign Up
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          Already have an account? <Link to="/" className="text-blue-600 font-bold">Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;