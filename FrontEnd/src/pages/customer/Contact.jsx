import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, Twitter, Instagram, Github, Loader2 } from "lucide-react";
import axios from "axios";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Booking Inquiry",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Connects to our new backend route
      const res = await axios.post("http://localhost:5000/contact", formData);
      alert(res.data.message || "Message sent! The Eventra team will get back to you soon.");
      
      // Clear form on success
      setFormData({
        name: "",
        email: "",
        subject: "Booking Inquiry",
        message: ""
      });
    } catch (err) {
      console.error(err);
      alert("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans p-6 md:p-12 selection:bg-blue-500">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Have questions about a concert or need help with your Khalti payment? Our team is here to help you 24/7.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Contact Info (4 Cols) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2rem] backdrop-blur-md">
              <h2 className="text-2xl font-bold mb-8">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-500/10 p-3 rounded-xl text-blue-400">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Email Us</p>
                    <p className="text-lg">eventra121@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-purple-500/10 p-3 rounded-xl text-purple-400">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Call Us</p>
                    <p className="text-lg">9702323130</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-pink-500/10 p-3 rounded-xl text-pink-400">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Headquarters</p>
                    <p className="text-lg">Pokhara 17, Birauta</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-12 pt-8 border-t border-slate-800">
                <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-4">Follow the Vibe</p>
                <div className="flex gap-4">
                  <a href="#" className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all"><Twitter size={20} /></a>
                  <a href="#" className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-pink-600 transition-all"><Instagram size={20} /></a>
                  <a href="#" className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-slate-700 transition-all"><Github size={20} /></a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form (8 Cols) */}
          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit} className="bg-slate-900/20 border border-slate-800 p-8 md:p-12 rounded-[2.5rem] shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Your Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required 
                    placeholder="John Doe" 
                    className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required 
                    placeholder="john@example.com" 
                    className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Subject</label>
                <select 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition appearance-none"
                >
                  <option>Booking Inquiry</option>
                  <option>Payment Issue (Khalti)</option>
                  <option>Event Partnership</option>
                  <option>Technical Support</option>
                </select>
              </div>

              <div className="space-y-2 mb-8">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Message</label>
                <textarea 
                  rows="5" 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required 
                  placeholder="How can we help you create a great event?" 
                  className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
                ></textarea>
              </div>

              <button 
                disabled={isSubmitting}
                className={`group w-full bg-gradient-to-r ${isSubmitting ? 'from-slate-600 to-slate-500 cursor-not-allowed' : 'from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500'} text-white font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-900/20`}
              >
                {isSubmitting ? (
                  <>
                    SENDING... <Loader2 size={20} className="animate-spin" />
                  </>
                ) : (
                  <>
                    SEND MESSAGE
                    <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;