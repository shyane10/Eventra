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
        endpoint = "http://localhost:5000/organizerRegister";
        payload = {
          organizerName: form.name,
          organizerEmail: form.email,
          password: form.password,
          venue: form.venue,
          phoneNumber: form.phoneNumber,
        };
      } else {
        endpoint = "http://localhost:5000/userRegister";
        payload = {
          name: form.name,
          email: form.email,  
          password: form.password,
        };
      }

      const response = await axios.post(endpoint, payload);

      alert(response.data.message);
      // Navigate to OTP page, passing the email for verification
      navigate("/verify-otp", { state: { email: form.email } });
      
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed. Please check the console.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl text-white">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Eventra Logo" className="h-20 w-auto object-contain mix-blend-screen" />
        </div>

        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required className="w-full px-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white" />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full px-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white" />
          
          <select name="role" onChange={handleChange} className="w-full px-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white">
            <option value="user">Standard User</option>
            <option value="organizer">Event Organizer</option>
          </select>

          {form.role === "organizer" && (
            <div className="space-y-4 p-4 border border-blue-600/30 rounded-lg bg-blue-950/20">
              <input type="text" name="venue" placeholder="Venue Name" onChange={handleChange} required className="w-full px-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white" />
              <input type="number" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required className="w-full px-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white" />
            </div>
          )}

          <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" onChange={handleChange} required className="w-full px-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white" />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required className="w-full px-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white" />
          
          <button disabled={loading} className="w-full py-2 bg-blue-600 rounded-lg hover:bg-blue-700 font-semibold transition mt-2">
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-slate-400 mt-6 text-sm">
          Already have an account? <button onClick={() => navigate("/")} className="text-blue-500 hover:underline">Login</button>
        </p>
      </div>
    </div>
  );
};

export default Register;