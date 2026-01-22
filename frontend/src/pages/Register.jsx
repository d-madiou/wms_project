import React, { useState } from "react";
import AuthService from "../services/auth.service";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Lock, 
  Shield, 
  ArrowRight, 
  Loader2, 
  AlertCircle, 
  UserPlus,
  CheckCircle2
} from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "operator"
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await AuthService.register(
        formData.username, 
        formData.email, 
        formData.password, 
        formData.role
      );
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Registration failed. Username or Email might be taken.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative bg-slate-900 overflow-hidden py-10">
      
      {/* --- BACKGROUND LAYER --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-slate-900/80 z-10 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent z-10" />
        
        <img 
            src="https://images.unsplash.com/photo-1553413077-190dd305871c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
            alt="Logistics Background" 
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
                    <UserPlus size={32} className="text-blue-600 absolute transition-all duration-300 group-hover:scale-110" />
                    <div className="absolute -right-1 -top-1 w-5 h-5 bg-orange-500 rounded-full border-2 border-white flex items-center justify-center">
                        <CheckCircle2 size={12} className="text-white" />
                    </div>
                </div> */}
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    The<span className="text-orange-600">House</span>
                </h2>
                <p className="text-slate-500 text-sm mt-2 font-medium uppercase tracking-wide">
                    Create Personnel Access
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

            <form onSubmit={handleRegister} className="space-y-5">
                
                {/* Username */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Username</label>
                    <div className="relative group">
                        <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center">
                            <User size={18} className="text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                        </div>
                        <input 
                            name="username"
                            type="text" 
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all font-medium"
                            placeholder="Choose ID"
                            onChange={handleChange}
                            required 
                        />
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Email</label>
                    <div className="relative group">
                        <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center">
                            <Mail size={18} className="text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                        </div>
                        <input 
                            name="email"
                            type="email" 
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all font-medium"
                            placeholder="name@thehouse.com"
                            onChange={handleChange} 
                        />
                    </div>
                </div>

                {/* Password */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Password</label>
                    <div className="relative group">
                        <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center">
                            <Lock size={18} className="text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                        </div>
                        <input 
                            name="password"
                            type="password" 
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all font-medium"
                            placeholder="Create secure password"
                            onChange={handleChange}
                            required 
                        />
                    </div>
                </div>

                {/* Role Selection */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Access Level</label>
                    <div className="relative group">
                        {/* <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center">
                            <Shield size={18} className="text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                        </div> */}
                        <select 
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all font-medium appearance-none cursor-pointer"
                        >
                            <option value="manager">Manager (Admin Access)</option>
                            <option value="operator">Operator (Standard Access)</option>
                            <option value="driver">Driver (Read Only)</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98] transition-all mt-4"
                >
                    {loading ? (
                        <>
                           <Loader2 className="animate-spin" size={20} />
                           <span>Creating Access...</span>
                        </>
                    ) : (
                        <>
                           <span>Register Account</span>
                           <ArrowRight size={20} />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <p className="text-slate-500 text-sm">
                    Already have an ID?{" "}
                    <Link to="/" className="text-blue-600 font-bold hover:text-orange-600 transition-colors">
                        Login Here
                    </Link>
                </p>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;