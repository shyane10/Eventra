import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Users, Calendar, IndianRupee, Trash2, ShieldCheck, 
  Search, Filter, CheckCircle, Clock, ChevronRight,
  TrendingUp, Activity, MoreHorizontal, MapPin
} from "lucide-react";

const AdminHome = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const stats = [
    { label: "Total Revenue", value: "रू 124,500", icon: IndianRupee, color: "text-emerald-400", bg: "bg-emerald-500/10", trend: "+12%" },
    { label: "Active Events", value: "156", icon: Calendar, color: "text-blue-400", bg: "bg-blue-500/10", trend: "+5%" },
    { label: "Total Users", value: "1,240", icon: Users, color: "text-purple-400", bg: "bg-purple-500/10", trend: "+18%" },
    { label: "System Uptime", value: "99.9%", icon: Activity, color: "text-orange-400", bg: "bg-orange-500/10", trend: "Optimal" },
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/events/all");
        setEvents(res.data.events || []);
      } catch (err) {
        console.error("Error fetching admin data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Permanently remove this event from the platform?")) {
      try {
        await axios.delete(`http://localhost:5000/api/events/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setEvents(events.filter(e => e._id !== id));
      } catch (err) {
        alert("Action failed.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">
              System Command Center
            </h2>
            <p className="text-slate-500 mt-1">Global oversight of all Eventra operations.</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Search database..." 
                className="bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 outline-none w-64 lg:w-80 transition-all shadow-inner"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-slate-900/40 border border-white/5 p-6 rounded-3xl hover:border-blue-500/30 transition-all group backdrop-blur-sm">
              <div className="flex justify-between items-start mb-4">
                <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl shadow-lg`}>
                  <stat.icon size={24} />
                </div>
                <span className="text-[10px] font-bold px-2 py-1 bg-slate-800 rounded-lg text-slate-400 group-hover:text-blue-400 transition-colors">
                  {stat.trend}
                </span>
              </div>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-bold mt-1 text-white">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Management Table */}
        <div className="bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
              <h3 className="font-bold text-lg">Active Event Listings</h3>
            </div>
            <button className="text-slate-400 hover:text-white p-2 transition">
              <Filter size={20} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 text-[10px] uppercase tracking-[0.2em] border-b border-white/5">
                  <th className="px-8 py-5">Event Information</th>
                  <th className="px-8 py-5">Category</th>
                  <th className="px-8 py-5">Timeline</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {events
                  .filter(ev => ev.title.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((event) => (
                  <tr key={event._id} className="hover:bg-blue-600/[0.03] transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <img 
                          src={event.eventImage} 
                          className="w-14 h-10 object-cover rounded-xl border border-white/10 shadow-sm"
                          alt="event"
                        />
                        <div>
                          <p className="font-bold text-sm text-slate-100">{event.title}</p>
                          <p className="text-[10px] text-slate-500 flex items-center gap-1 uppercase">
                            <MapPin size={10} /> {event.venueName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-[10px] px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-400 font-bold">
                        {event.category}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-xs font-medium text-slate-300">{new Date(event.startDate).toLocaleDateString()}</p>
                      <p className="text-[10px] text-slate-500 uppercase">{new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </td>
                    <td className="px-8 py-5">
                      <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase ${event.status === 'Published' ? 'text-emerald-500' : 'text-orange-500'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${event.status === 'Published' ? 'bg-emerald-500' : 'bg-orange-500'}`}></span>
                        {event.status}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => handleDelete(event._id)}
                        className="p-2.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-lg shadow-red-900/10"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;