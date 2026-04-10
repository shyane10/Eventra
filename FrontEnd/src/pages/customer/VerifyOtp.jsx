import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import logo from "../../image/image.png"; 

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  
  // Register page bata pathayeko data linu paryo
  const email = location.state?.email;
  const role = location.state?.role; // 'user' wa 'organizer'

  // Yedi data chhaina bhane register page ma firta pathaidine
  useEffect(() => {
    if (!email) {
      alert("No email found. Please register first.");
      navigate("/register");
    }
  }, [email, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let endpoint = "";
      let payload = {};

      if (role === "organizer") {
        // Organizer verification
        endpoint = "http://localhost:5000/verify-otp";
        payload = {
          organizerEmail: email, // Organizer le 'organizerEmail' field khojcha
          otp: parseInt(otp)
        };
      } else {
        // User verification
        endpoint = "http://localhost:5000/verifyOtp";
        payload = {
          email: email, // User le 'email' field matra khojcha
          otp: parseInt(otp)
        };
      }

      const response = await axios.post(endpoint, payload);

      alert(response.data.message || "Account verified! Please login.");
      navigate("/"); // Redirect to Login page
    } catch (error) {
      console.error("Verification Error:", error);
      alert(error.response?.data?.message || "Verification failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl text-white text-center">
        
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Eventra Logo" className="h-20 w-auto object-contain" />
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Verify Your Account</h2>
        <p className="text-slate-400 mb-6 text-sm">
          Enter the 6-digit code sent to <br />
          <span className="text-blue-400 font-semibold">{email}</span>
          <br />
          <span className="text-xs text-slate-500 uppercase tracking-widest">({role})</span>
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            maxLength="6"
            placeholder="000000"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white text-center text-2xl tracking-[10px] focus:outline-none focus:border-blue-500 font-mono"
          />
          
          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-bold transition flex items-center justify-center gap-2 ${
              loading ? "bg-blue-800 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <>
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Verifying...
              </>
            ) : (
              "Verify Account"
            )}
          </button>
        </form>

        <div className="mt-6 text-sm text-slate-500">
          Didn't receive the code? 
          <button className="text-blue-500 hover:underline ml-1" onClick={() => window.location.reload()}>
            Resend
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;