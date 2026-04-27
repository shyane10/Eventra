import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import logo from "../../image/image.png"; 

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "user", 
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Determine Endpoints based on Role
      const endpoint = form.role === "organizer" 
        ? "http://localhost:5000/api/organizer/organizerLogin" 
        : "http://localhost:5000/api/auth/userLogin";

      // 2. Prepare Payload
      const payload = form.role === "organizer" 
        ? { organizerEmail: form.email, password: form.password } 
        : { email: form.email, password: form.password };

      const response = await axios.post(endpoint, payload);

      // --- 3. STORAGE LOGIC ---
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        
        // Extract the user/organizer object from response
        const profileData = form.role === "organizer" ? response.data.organizer : response.data.user;

        if (profileData) {
          // Identify the actual role from DB (important for Admin detection)
          const actualRole = profileData.role || form.role;
          
          localStorage.setItem("role", actualRole);
          localStorage.setItem("user", JSON.stringify(profileData));
          
          if (form.role === "organizer") {
            localStorage.setItem("Organizer", JSON.stringify(profileData));
          }

          alert("Login successful!");

          // --- 4. NAVIGATION LOGIC (Role Based) ---
          if (actualRole === "admin") {
            navigate("/admin-dashboard"); // Redirect to the Command Center
          } else if (actualRole === "organizer") {
            navigate("/organizer-home");
          } else {
            navigate("/home");
          }
        }
      } else {
        alert("Token not received. Check server console.");
      }
      
    } catch (error) {
      console.error("Login Error:", error);
      alert(error.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 font-sans text-white">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Eventra Logo" className="h-20 w-auto object-contain" />
        </div>

        <h2 className="text-3xl font-bold mb-2 text-center">Welcome Back</h2>
        <p className="text-slate-400 text-center mb-8 text-sm">Log in to manage your events</p>

        {/* Role Switcher */}
        <div className="flex bg-slate-950 p-1 rounded-xl mb-8 border border-slate-800">
          <button
            type="button"
            onClick={() => setForm({...form, role: "user"})}
            className={`flex-1 py-2.5 rounded-lg font-semibold transition-all ${
              form.role === "user" ? "bg-blue-600 text-white shadow-lg" : "text-slate-500 hover:text-white"
            }`}
          >
            User
          </button>
          <button
            type="button"
            onClick={() => setForm({...form, role: "organizer"})}
            className={`flex-1 py-2.5 rounded-lg font-semibold transition-all ${
              form.role === "organizer" ? "bg-blue-600 text-white shadow-lg" : "text-slate-500 hover:text-white"
            }`}
          >
            Organizer
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="name@company.com"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-medium text-slate-400 uppercase tracking-wider">Password</label>
              <Link to="/forgot-password" size={12} className="text-xs font-bold text-blue-500 hover:text-blue-400 transition">
                Forgot Password?
              </Link>
            </div>
            
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 text-xs font-bold uppercase hover:text-blue-400"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold transition-all mt-4 flex items-center justify-center gap-2 ${
              loading ? "bg-blue-800 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
            }`}
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : "Sign In"}
          </button>
        </form>

        <p className="text-center text-slate-500 mt-8 text-sm">
          Don't have an account?{" "}
          <button onClick={() => navigate("/register")} className="text-blue-500 font-bold hover:underline">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;