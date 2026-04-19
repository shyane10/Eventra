import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../image/image.png"; 

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    venue: "", 
    phoneNumber: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      let endpoint = "";
      let payload = {};

      if (form.role === "organizer") {
        endpoint = "http://localhost:5000/api/organizer/organizerRegister";
        payload = {
          organizerName: form.name,
          organizerEmail: form.email,
          password: form.password,
          venue: form.venue,
          phoneNumber: form.phoneNumber,
        };
      } else {
        endpoint = "http://localhost:5000/api/auth/userRegister";
        payload = {
          name: form.name,
          email: form.email,  
          password: form.password,
        };
      }

      const response = await axios.post(endpoint, payload);

      alert(response.data.message || "Registration successful!");
      
      // Navigate to OTP page, passing the email for verification
      // State ma pathau-da email field match hunu parcha
      navigate("/verify-otp", { state: { email: form.email, role: form.role } });
      
    } catch (error) {
      console.error("Registration Error:", error);
      alert(error.response?.data?.message || "Registration failed. Please check the console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center px-4 py-12 font-sans">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-white">
        
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Eventra Logo" className="h-20 w-auto object-contain" />
        </div>

        <h2 className="text-3xl font-bold mb-2 text-center">Join Eventra</h2>
        <p className="text-slate-400 text-center mb-8 text-sm">Create your account to get started</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Full Name</label>
            <input type="text" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-blue-500 outline-none transition" />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Email Address</label>
            <input type="email" name="email" placeholder="john@example.com" value={form.email} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-blue-500 outline-none transition" />
          </div>
          
          {/* Role Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Account Type</label>
            <select name="role" value={form.role} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer">
              <option value="user">Standard User</option>
              <option value="organizer">Event Organizer</option>
            </select>
          </div>

          {/* Organizer Specific Fields */}
          {form.role === "organizer" && (
            <div className="space-y-4 p-4 border border-blue-600/20 rounded-xl bg-blue-600/5 animate-in fade-in duration-300">
              <div>
                <label className="block text-xs font-semibold text-blue-400 mb-1 uppercase">Venue Location</label>
                <input type="text" name="venue" placeholder="Hotel Yak & Yeti" value={form.venue} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-blue-400 mb-1 uppercase">Contact Number</label>
                <input type="number" name="phoneNumber" placeholder="98XXXXXXXX" value={form.phoneNumber} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white" />
              </div>
            </div>
          )}

          {/* Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">Password</label>
              <input type={showPassword ? "text" : "password"} name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">Confirm</label>
              <input type="password" name="confirmPassword" placeholder="••••••••" value={form.confirmPassword} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input type="checkbox" id="show" onChange={() => setShowPassword(!showPassword)} className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-blue-600" />
            <label htmlFor="show" className="text-xs text-slate-400 cursor-pointer">Show Password</label>
          </div>
          
          <button 
            type="submit"
            disabled={loading} 
            className={`w-full py-3.5 rounded-xl font-bold transition-all mt-4 flex items-center justify-center gap-2 ${
              loading ? "bg-blue-800 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
            }`}
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : "Create Account"}
          </button>
        </form>

        <p className="text-center text-slate-400 mt-8 text-sm">
          Already have an account?{" "}
          <button onClick={() => navigate("/")} className="text-blue-500 font-bold hover:underline">Sign In</button>
        </p>
      </div>
    </div>
  );
};

export default Register;