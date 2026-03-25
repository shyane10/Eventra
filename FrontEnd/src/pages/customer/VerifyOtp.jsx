import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import logo from "../../image/image.png"; 

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  
  // Retrieve the email passed from the Register page
  const email = location.state?.email;

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://localhost:5000/verifyOtp", {
        email,
        otp
      });
      alert("Account verified! Please login.");
      navigate("/"); // Redirect to Login page
    } catch (error) {
      alert(error.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl text-white text-center">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Eventra Logo" className="h-16 w-auto object-contain mix-blend-screen" />
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Verify Email</h2>
        <p className="text-slate-400 mb-6 text-sm">
          Enter the 6-digit code sent to <strong>{email}</strong>
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            maxLength="6"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white text-center text-xl tracking-widest focus:outline-none focus:border-blue-500"
          />
          <button 
            disabled={loading}
            className="w-full py-2 bg-blue-600 rounded-lg hover:bg-blue-700 font-semibold transition"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;