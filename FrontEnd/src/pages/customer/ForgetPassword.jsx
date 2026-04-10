import React, { useState } from "react";
import axios from "axios";
import { Mail, ArrowLeft, Loader2, Send, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      // Endpoint matches your backend: /forgotPassword
      const res = await axios.post("http://localhost:5000/forgotPassword", { email });
      
      setStatus({ type: "success", message: "Reset code sent! Redirecting..." });
      
      // Wait 2 seconds so user sees the success message, then move to reset screen
      setTimeout(() => {
        navigate("/reset-password");
      }, 2000);

    } catch (err) {
      setStatus({ 
        type: "error", 
        message: err.response?.data?.message || "Failed to send code. Try again." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1a1a1a] border border-white/10 p-8 rounded-3xl shadow-2xl">
        {/* Link back to root (Login) */}
        <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-white mb-8 transition text-sm">
          <ArrowLeft size={16} /> Back to Login
        </Link>

        <div className="text-center mb-8">
          <div className="bg-blue-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="text-blue-500" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-white">Forgot Password?</h2>
          <p className="text-slate-400 mt-2 text-sm">Enter your email and we'll send you a 6-digit reset code.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input 
              type="email"
              placeholder="Email Address" 
              className="w-full bg-black/40 border border-white/10 p-4 pl-12 rounded-xl text-white outline-none focus:border-blue-500 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <><Send size={20} /> Send Code</>}
          </button>
        </form>

        {status.message && (
          <div className={`mt-6 p-4 rounded-xl text-sm flex items-center gap-3 border ${
            status.type === "success" 
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
              : "bg-red-500/10 text-red-400 border-red-500/20"
          }`}>
            {status.type === "success" && <CheckCircle size={18} />}
            {status.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;