import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  CalendarDays, 
  Users, 
  Settings, 
  LogOut, 
  PlusCircle, 
  BarChart3,
  Bell,
  ChevronRight,
  PackagePlus
} from "lucide-react";

const OrganizerDB = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [organizer, setOrganizer] = useState(null);

  // 1. Load organizer data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setOrganizer(JSON.parse(storedUser));
    } else {
      // Basic Protection: Redirect to login if no user found
      navigate("/");
    }
  }, [navigate]);

  // 2. LOGOUT HANDLER
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out from the Organizer Panel?");
    if (confirmLogout) {
      localStorage.clear();
      navigate("/"); 
    }
  };

  // Mock Stats Data
  const stats = [
    { label: "Total Events", value: "12", icon: <CalendarDays className="text-blue-500" />, trend: "+2 this month" },
    { label: "Total Bookings", value: "1,240", icon: <Users className="text-purple-500" />, trend: "+15% growth" },
    { label: "Revenue", value: "Rs. 85,000", icon: <BarChart3 className="text-green-500" />, trend: "+10% vs last week" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col hidden md:flex sticky top-0 h-screen">
        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-900/20">
            <CalendarDays size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Eventra</h1>
            <span className="text-blue-500 text-[10px] uppercase tracking-widest font-bold">Organizer Panel</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
          
          <button 
            onClick={() => setActiveTab("events")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === 'events' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <CalendarDays size={20} /> My Events
          </button>

          {/* NEW: Manage Merch Link in Sidebar */}
          <button 
            onClick={() => navigate("/create-product")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <PackagePlus size={20} /> Manage Merch
          </button>

          <button 
            onClick={() => setActiveTab("attendees")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === 'attendees' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Users size={20} /> Attendees
          </button>

          <button 
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === 'settings' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Settings size={20} /> Settings
          </button>
        </nav>

        {/* User Profile Summary */}
        <div className="mb-4 p-3 bg-slate-950/50 rounded-xl border border-slate-800">
            <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Logged in as</p>
            <p className="text-sm font-medium text-blue-400 truncate">{organizer?.organizerEmail || "Organizer Account"}</p>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors duration-200 font-semibold cursor-pointer"
        >
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-8 overflow-y-auto">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight italic uppercase">
                {activeTab === 'dashboard' ? 'Dashboard' : 
                 activeTab === 'events' ? 'My Events' : 
                 activeTab === 'attendees' ? 'Attendees' : 'Settings'}
            </h2>
            <p className="text-slate-500 text-sm font-medium">Welcome back, {organizer?.organizerName || 'Organizer'}</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <button className="p-3 bg-[#161e2f] border border-white/5 rounded-2xl text-slate-400 hover:text-white transition-all shadow-lg relative">
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 border-2 border-[#161e2f] rounded-full"></span>
            </button>
            
            {/* ACTION: CREATE PRODUCT BUTTON */}
            <button 
              onClick={() => navigate("/create-product")}
              className="flex items-center gap-2 px-6 py-3.5 bg-[#1e293b] hover:bg-[#2d3a4f] text-white rounded-2xl font-bold transition-all border border-white/5 shadow-xl active:scale-95 cursor-pointer"
            >
              <PackagePlus size={18} className="text-blue-400" />
              <span>Create Product</span>
            </button>

            {/* ACTION: CREATE EVENT BUTTON */}
            <button 
              onClick={() => navigate("/create-event")}
              className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] active:scale-95 cursor-pointer"
            >
              <PlusCircle size={18} />
              <span>Create Event</span>
            </button>
          </div>
        </header>

        {/* Tab Content Logic */}
        {activeTab === "dashboard" && (
          <>
            {/* Stats Grid */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-blue-500/30 transition-all duration-300 group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 group-hover:border-blue-500/50 transition-colors">
                      {stat.icon}
                    </div>
                    <span className="text-xs font-bold text-green-400 bg-green-400/10 px-3 py-1 rounded-full">
                      {stat.trend}
                    </span>
                  </div>
                  <h3 className="text-slate-500 font-semibold mb-1 uppercase text-xs tracking-wider">{stat.label}</h3>
                  <p className="text-3xl font-bold text-white tracking-tight">{stat.value}</p>
                </div>
              ))}
            </section>

            {/* Upcoming Events Table */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                <h3 className="text-xl font-bold text-white">Recent Events</h3>
                <button 
                  onClick={() => setActiveTab("events")}
                  className="text-sm font-bold text-blue-500 hover:text-blue-400 flex items-center gap-1 transition-colors"
                >
                  View All <ChevronRight size={16} />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-950/50 text-slate-500 text-[10px] uppercase tracking-[2px] font-black">
                      <th className="px-6 py-5">Event Name</th>
                      <th className="px-6 py-5">Date</th>
                      <th className="px-6 py-5">Venue</th>
                      <th className="px-6 py-5">Status</th>
                      <th className="px-6 py-5 text-right">Bookings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    <tr className="hover:bg-slate-800/30 transition-colors group">
                      <td className="px-6 py-5 font-bold text-white group-hover:text-blue-400 transition-colors">Music Festival 2026</td>
                      <td className="px-6 py-5 text-slate-400 text-sm">March 25, 2026</td>
                      <td className="px-6 py-5 text-slate-400 text-sm">Kathmandu, Nepal</td>
                      <td className="px-6 py-5">
                        <span className="px-3 py-1 text-[10px] font-black uppercase bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">Confirmed</span>
                      </td>
                      <td className="px-6 py-5 text-slate-300 font-mono text-right font-bold">450/500</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30 transition-colors group">
                      <td className="px-6 py-5 font-bold text-white group-hover:text-blue-400 transition-colors">Tech Workshop</td>
                      <td className="px-6 py-5 text-slate-400 text-sm">April 10, 2026</td>
                      <td className="px-6 py-5 text-slate-400 text-sm">Pokhara Hall</td>
                      <td className="px-6 py-5">
                        <span className="px-3 py-1 text-[10px] font-black uppercase bg-yellow-500/10 text-yellow-400 rounded-lg border border-yellow-500/20">In Draft</span>
                      </td>
                      <td className="px-6 py-5 text-slate-300 font-mono text-right font-bold">0/100</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {/* Placeholder for other tabs */}
        {activeTab !== "dashboard" && (
            <div className="flex flex-col items-center justify-center h-[50vh] text-slate-500 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/20">
                <div className="p-4 bg-slate-900 rounded-full mb-4">
                  <PlusCircle size={40} className="text-slate-700" />
                </div>
                <p className="text-xl font-bold text-slate-400">Section Under Construction</p>
                <p className="text-sm italic">The {activeTab} module will be integrated soon.</p>
                <button 
                  onClick={() => setActiveTab("dashboard")}
                  className="mt-6 text-blue-500 hover:underline font-bold"
                >
                  Back to Overview
                </button>
            </div>
        )}
      </main>
    </div>
  );
};

export default OrganizerDB;