import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../image/image.png"; 

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    email: "", 
    password: "", 
    role: "user" // Default to user
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Choose the endpoint based on the selected entity
    const endpoint = form.role === "organizer" 
      ? "http://localhost:5000/organizerLogin" 
      : "http://localhost:5000/userLogin";

    try {
      const response = await axios.post(endpoint, {
        email: form.email,
        password: form.password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", form.role);

      alert("Login successful!");
      // Redirect based on entity
      navigate(form.role === "organizer" ? "/organizer-home" : "/home");
    } catch (error) {
      alert(error.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl text-white">
        
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Eventra Logo" className="h-20 w-auto object-contain mix-blend-screen" />
        </div>

        <h2 className="text-2xl font-bold mb-6 text-center">Login to Eventra</h2>

        {/* Entity/Role Toggle */}
        <div className="flex bg-slate-950 p-1 rounded-lg mb-6 border border-slate-800">
          <button
            onClick={() => setForm({...form, role: "user"})}
            className={`flex-1 py-2 rounded-md transition ${form.role === "user" ? "bg-blue-600" : "hover:bg-slate-800"}`}
          >
            User
          </button>
          <button
            onClick={() => setForm({...form, role: "organizer"})}
            className={`flex-1 py-2 rounded-md transition ${form.role === "organizer" ? "bg-blue-600" : "hover:bg-slate-800"}`}
          >
            Organizer
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 text-blue-500 text-sm"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          
          <button className="w-full py-2 bg-blue-600 rounded-lg hover:bg-blue-700 font-semibold transition mt-2">
            Login
          </button>
        </form>

        <p className="text-center text-slate-400 mt-4 text-sm">
          Don't have an account?{" "}
          <button onClick={() => navigate("/register")} className="text-blue-500 hover:underline">
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;