import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthService from "../services/auth.service";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Authenticate
      const res = await AuthService.login(username, password);

      const accessToken = res.access || res.data?.access;
      const refreshToken = res.refresh || res.data?.refresh;

      if (!accessToken) {
        throw new Error("No access token received from server.");
      }

      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);

      // 2. Fetch User Profile
      // We do this immediately so we know the role (Admin/Operator/etc)
      const profileRes = await AuthService.getProfile();
      
      // Same check for profile data
      const role = profileRes.role || profileRes.data?.role;
      const user = profileRes.username || profileRes.data?.username;

      localStorage.setItem("user_role", role);
      localStorage.setItem("user_name", user);

      // 3. Redirect
      navigate("/dashboard");

    } catch (err) {
      console.error("Login Error:", err);
      setError("Login failed. Please check your username and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Sign In</h2>
          <p className="text-gray-500 text-sm mt-1">Warehouse Management System</p>
        </div>
        
        {/* Error Message Display */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
            <input 
              type="text" 
              className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input 
              type="password" 
              className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full text-white font-bold py-3 rounded transition duration-200 
              ${loading ? "bg-blue-400 cursor-wait" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 font-bold hover:underline">
            Register here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;