import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion"; 
import { 
  User, 
  Lock, 
  Loader2, 
  ArrowRight, 
  AlertCircle, 
  Package, // Changed icon for variety
  CheckCircle2
} from "lucide-react";
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
      const res = await AuthService.login(username, password);
      const accessToken = res.access || res.data?.access;
      const refreshToken = res.refresh || res.data?.refresh;

      if (!accessToken) throw new Error("No access token received.");

      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);

      const profileRes = await AuthService.getProfile();
      const role = profileRes.role || profileRes.data?.role;
      const user = profileRes.username || profileRes.data?.username;

      localStorage.setItem("user_role", role);
      localStorage.setItem("user_name", user);

      navigate("/dashboard");

    } catch (err) {
      console.error("Login Error:", err);
      setError("Invalid credentials. Please check and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative bg-slate-900 overflow-hidden">
      
      {/* --- BACKGROUND LAYER --- */}
      <div className="absolute inset-0 z-0">
        {/* Dark Blue Overlay */}
        <div className="absolute inset-0 bg-slate-900/80 z-10 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent z-10" />
        
        {/* Background Image */}
        
        <img 
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
            alt="Warehouse Background" 
            className="w-full h-full object-cover opacity-50"
        />
      </div>

      {/* --- CONTENT CARD --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-20 w-full max-w-md mx-4"
      >
        {/* Top decorative accent */}
        <div className="h-2 w-full bg-gradient-to-r from-orange-600 via-orange-500 to-blue-600 rounded-t-lg shadow-lg shadow-orange-500/20" />
        
        <div className="bg-white rounded-b-lg shadow-2xl p-8 md:p-10">
            
            {/* Header Section */}
            <div className="text-center mb-8">
                {/* <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4 border border-blue-100 relative group">
                    <Package size={32} className="text-blue-600 absolute transition-all duration-300 group-hover:scale-110" />
                    <div className="absolute -right-1 -top-1 w-5 h-5 bg-orange-500 rounded-full border-2 border-white flex items-center justify-center">
                        <CheckCircle2 size={12} className="text-white" />
                    </div>
                </div> */}
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    The<span className="text-orange-600">House</span>
                </h2>
                <p className="text-slate-500 text-sm mt-2 font-medium uppercase tracking-wide">
                    Secure Logistics Login
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-red-50 border-l-4 border-red-500 text-red-700 text-sm p-4 mb-6 rounded-r-md flex items-start gap-3"
                >
                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                    <span>{error}</span>
                </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
                {/* Username Input */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                        Username
                    </label>
                    <div className="relative group">
                        <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center">
                            <User size={18} className="text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                        </div>
                        <input 
                            type="text" 
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all font-medium"
                            placeholder="Enter your ID"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* Password Input */}
                <div>
                    <div className="flex justify-between items-center mb-1.5 ml-1">
                         <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Password
                        </label>
                        <a href="#" className="text-xs font-semibold text-blue-600 hover:text-orange-600 transition-colors">
                            Forgot Password?
                        </a>
                    </div>
                    <div className="relative group">
                        <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center">
                            <Lock size={18} className="text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                        </div>
                        <input 
                            type="password" 
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all font-medium"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* Submit Button - THE ORANGE ACCENT */}
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98] transition-all mt-2"
                >
                    {loading ? (
                        <>
                           <Loader2 className="animate-spin" size={20} />
                           <span>Authenticating...</span>
                        </>
                    ) : (
                        <>
                           <span>Access Dashboard</span>
                           <ArrowRight size={20} />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <p className="text-slate-500 text-sm">
                    Don't have an ID?{" "}
                    <Link to="/register" className="text-blue-600 font-bold hover:text-orange-600 transition-colors">
                        Register Account
                    </Link>
                </p>
            </div>
        </div>
        
        {/* Footer Credit */}
        <p className="text-center text-slate-400 text-xs mt-6 font-medium">
            &copy; 2026 The House Systems. Secured.
        </p>

      </motion.div>
    </div>
  );
};

export default Login;