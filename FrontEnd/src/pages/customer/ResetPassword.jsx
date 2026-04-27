import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Lock, Eye, EyeOff, CheckCircle2, Loader2, Hash } from "lucide-react";

const ResetPassword = () => {
  const navigate = useNavigate();
  
  // State for the 6-digit code and passwords
  const [code, setCode] = useState(""); 
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setStatus({ type: "error", message: "Passwords do not match." });
    }

    if (code.length !== 6) {
      return setStatus({ type: "error", message: "Please enter the 6-digit code." });
    }

    setLoading(true);
    try {
      // Updated to send { code, password } to /resetPassword (no token in URL)
      await axios.post(`http://localhost:5000/api/auth/resetPassword`, { 
        code, 
        password 
      });

      setStatus({ type: "success", message: "Password updated! Redirecting to login..." });
      
      // Navigate to your login route (usually "/" based on your App.jsx)
      setTimeout(() => navigate("/"), 2000); 
    } catch (err) {
      setStatus({ type: "error", message: err.response?.data?.message || "Invalid or expired code." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <div className="bg-blue-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-blue-500" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-white">Reset Password</h2>
          <p className="text-slate-400 mt-2 text-sm">Enter the code sent to your email</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* OTP Code Input */}
          <div className="relative">
            <Hash className="absolute left-4 top-4 text-slate-500" size={20} />
            <input 
              type="text"
              placeholder="6-Digit Reset Code" 
              maxLength="6"
              className="w-full bg-slate-950 border border-slate-800 p-4 pl-12 rounded-xl text-white outline-none focus:border-blue-500 transition"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>

          {/* New Password Input */}
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"}
              placeholder="New Password" 
              className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-white outline-none focus:border-blue-500 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 text-slate-500 hover:text-white"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirm Password Input */}
          <input 
            type="password"
            placeholder="Confirm New Password" 
            className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-white outline-none focus:border-blue-500 transition"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Update Password"}
          </button>
        </form>

        {status.message && (
          <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 border ${
            status.type === "success" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"
          }`}>
            {status.type === "success" && <CheckCircle2 size={18} />}
            <span className="text-sm font-medium">{status.message}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;