import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Users, Calendar, IndianRupee, Trash2, 
  Search, Filter, Activity, MapPin, LogOut,
  Briefcase, FileText, Settings, ShieldCheck, 
  ChevronRight, Download, Save, TrendingUp
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const AdminHome = () => {
  const [activeTab, setActiveTab] = useState("events");
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [dynamicStats, setDynamicStats] = useState({
    totalRevenue: "रू 0",
    adminRevenue: "रू 0",
    activeEvents: "0",
    totalUsers: "0",
    totalOrganizers: "0",
    commissionRate: "30",
    uptime: "100%"
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [newCommission, setNewCommission] = useState("");
  const [isUpdatingCommission, setIsUpdatingCommission] = useState(false);
  
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 1. Fetch Dynamic Data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, eventsRes, usersRes, organizersRes, chartRes] = await Promise.all([
        axios.get("http://localhost:5000/api/admin/stats", { 
          headers: { Authorization: `Bearer ${token}` } 
        }),
        axios.get("http://localhost:5000/api/events/all"),
        axios.get("http://localhost:5000/api/admin/users", {
            headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("http://localhost:5000/api/admin/organizers", {
            headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("http://localhost:5000/api/admin/chart-data", {
            headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setDynamicStats(statsRes.data.stats);
      setNewCommission(statsRes.data.stats.commissionRate);
      setEvents(eventsRes.data.events || []);
      setUsers(usersRes.data.users || []);
      setOrganizers(organizersRes.data.organizers || []);
      setChartData(chartRes.data.chartData || []);
    } catch (err) {
      console.error("Dashboard Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. Stats Configuration
  const statsConfig = [
    { label: "Total Platform Revenue", value: dynamicStats.totalRevenue, icon: IndianRupee, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Admin Profit", value: dynamicStats.adminRevenue, icon: TrendingUp, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Total Managed Users", value: dynamicStats.totalUsers, icon: Users, color: "text-purple-400", bg: "bg-purple-500/10" },
    { label: "Active Platform Events", value: dynamicStats.activeEvents, icon: Calendar, color: "text-orange-400", bg: "bg-orange-500/10" },
  ];

  // 3. Handlers
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Permanently remove this event?")) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvents(events.filter(e => e._id !== id));
      } catch (err) {
        alert("Action failed.");
      }
    }
  };

  const handleUpdateCommission = async () => {
    try {
      setIsUpdatingCommission(true);
      await axios.put("http://localhost:5000/api/admin/config", 
        { adminCommissionRate: Number(newCommission) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Commission rate updated successfully!");
      fetchData(); // Refresh stats
    } catch (err) {
      console.error("Update Error:", err);
      const errorMsg = err.response?.data?.message || "Platform communication failed.";
      alert(`Failed to update commission: ${errorMsg}`);
    } finally {
      setIsUpdatingCommission(false);
    }
  };

  const generateAndDownloadReport = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/report", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const { bookings, orders, commissionRate } = res.data.report;

      // Simple CSV generation
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "Type,Item/Event,User,Email,Amount,Admin Share,Date\n";

      bookings.forEach(b => {
        const adminShare = (b.totalPaid * commissionRate) / 100;
        csvContent += `Booking,${b.event?.title},${b.user?.name},${b.user?.email},${b.totalPaid},${adminShare},${new Date(b.createdAt).toLocaleDateString()}\n`;
      });

      orders.forEach(o => {
        const adminShare = (o.totalPaid * commissionRate) / 100;
        csvContent += `Order,Shop Items,${o.user?.name},${o.user?.email},${o.totalPaid},${adminShare},${new Date(o.createdAt).toLocaleDateString()}\n`;
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Eventra_Revenue_Report_${new Date().toLocaleDateString()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert("Failed to generate report.");
    }
  };

  if (loading) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white font-black italic text-2xl tracking-tighter">INITIALIZING COMMAND CENTER...</div>;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-8">
      <div className="max-w-7xl mx-auto space-y-10 pb-20">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-4xl font-black bg-gradient-to-r from-white via-slate-400 to-slate-700 bg-clip-text text-transparent italic">
              EVENTRA ADMIN
            </h2>
            <p className="text-slate-500 mt-1 font-medium tracking-tight">Real-time oversight of Eventra operations.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
                onClick={generateAndDownloadReport}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-all font-bold text-sm shadow-lg shadow-blue-500/20"
            >
              <FileText size={18} /> Generate Report
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2.5 rounded-xl transition-all font-bold text-sm border border-red-500/20"
            >
              <LogOut size={18} /> Exit
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsConfig.map((stat, i) => (
            <div key={i} className="bg-slate-900/60 border border-white/5 p-6 rounded-[2rem] backdrop-blur-xl hover:border-blue-500/30 transition-all group overflow-hidden relative">
              <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                 <stat.icon size={120} />
              </div>
              <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl w-fit mb-4 relative z-10`}>
                <stat.icon size={24} />
              </div>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] relative z-10">{stat.label}</p>
              <h3 className="text-3xl font-black mt-2 text-white relative z-10">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Revenue Graph & Commission Control */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-slate-900/60 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h4 className="font-black text-white text-lg">Revenue Growth</h4>
                        <p className="text-slate-500 text-xs">Platform performance over time</p>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full">
                        <TrendingUp size={12} /> Live
                    </div>
                </div>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff03" />
                            <XAxis 
                                dataKey="name" 
                                stroke="#64748b" 
                                fontSize={10} 
                                tickLine={false} 
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis 
                                stroke="#64748b" 
                                fontSize={10} 
                                tickLine={false} 
                                axisLine={false}
                                tickFormatter={(val) => `रू ${val > 1000 ? (val/1000).toFixed(1) + 'k' : val}`}
                            />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#0f172a', 
                                    border: '1px solid #1e293b', 
                                    borderRadius: '16px', 
                                    fontSize: '12px',
                                    backdropFilter: 'blur(10px)',
                                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                                }}
                                itemStyle={{ fontWeight: '800' }}
                                cursor={{ stroke: '#334155', strokeWidth: 2 }}
                            />
                            <Legend 
                                verticalAlign="top" 
                                align="right" 
                                height={36} 
                                iconType="circle"
                                wrapperStyle={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', paddingBottom: '20px' }}
                            />
                            <Area 
                                type="monotone" 
                                name="Total Revenue"
                                dataKey="revenue" 
                                stroke="#3b82f6" 
                                strokeWidth={4}
                                fillOpacity={1} 
                                fill="url(#colorRev)" 
                            />
                            <Area 
                                type="monotone" 
                                name="Admin Profit"
                                dataKey="profit" 
                                stroke="#10b981" 
                                strokeWidth={4}
                                fillOpacity={1} 
                                fill="url(#colorProfit)" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-slate-900/60 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-xl h-full flex flex-col justify-between">
                    <div>
                        <div className="bg-blue-500/10 p-4 rounded-3xl w-fit mb-6 text-blue-400">
                            <Settings size={32} />
                        </div>
                        <h4 className="font-black text-white text-xl">Platform Settings</h4>
                        <p className="text-slate-500 text-sm mt-2">Adjust core management variables and commission rates.</p>
                    </div>

                    <div className="mt-10 space-y-4">
                        <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 ml-1">Admin Commission (%)</label>
                        <div className="flex items-center gap-3 bg-black/40 p-4 rounded-3xl border border-white/5 group focus-within:border-blue-500/50 transition-all">
                            <input 
                                type="number" 
                                value={newCommission}
                                onChange={(e) => setNewCommission(e.target.value)}
                                className="bg-transparent font-black text-2xl w-full outline-none text-white placeholder-slate-700"
                            />
                            <button 
                                disabled={isUpdatingCommission}
                                onClick={handleUpdateCommission}
                                className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-2xl transition-all shadow-lg shadow-blue-500/20"
                            >
                                {isUpdatingCommission ? "..." : <Save size={20} />}
                            </button>
                        </div>
                        <p className="text-[10px] text-slate-600 italic px-2 font-medium">This change will apply to all future transactions immediately.</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Main Content Areas */}
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex gap-2 p-1.5 bg-slate-900/80 border border-white/5 rounded-[1.5rem] w-fit">
                    {["events", "users", "organizers"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                                activeTab === tab 
                                ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20 scale-105" 
                                : "text-slate-500 hover:text-slate-300"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                        type="text" 
                        placeholder={`Search ${activeTab}...`} 
                        className="bg-slate-900/60 border border-white/10 rounded-[1.5rem] pl-12 pr-6 py-3.5 text-sm focus:ring-2 focus:ring-blue-600 outline-none w-80 transition-all backdrop-blur-xl"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table Area */}
            <div className="bg-slate-900/60 border border-white/10 rounded-[3rem] overflow-hidden backdrop-blur-xl shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-slate-500 text-[10px] uppercase font-black tracking-[0.2em] border-b border-white/5">
                      <th className="px-10 py-8">{activeTab === 'events' ? 'Platform Event' : 'Entity Identity'}</th>
                      <th className="px-10 py-8">Primary Contact</th>
                      <th className="px-10 py-8">Status</th>
                      <th className="px-10 py-8 text-right">Operation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {/* Render Events */}
                    {activeTab === 'events' && events.length > 0 ? (
                      events
                      .filter(ev => ev.title.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((event) => (
                      <tr key={event._id} className="hover:bg-blue-600/[0.03] transition-colors group">
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-5">
                            <img src={event.eventImage} className="w-16 h-12 object-cover rounded-2xl border border-white/10 shadow-xl group-hover:scale-110 transition-transform" alt="" />
                            <div>
                              <p className="font-black text-sm text-slate-100">{event.title}</p>
                              <p className="text-[10px] text-slate-500 flex items-center gap-1 font-bold mt-1.5"><MapPin size={10} className="text-blue-500" /> {event.venueName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-6 text-xs text-slate-400 font-bold">{event.category}</td>
                        <td className="px-10 py-6">
                          <span className={`text-[9px] font-black uppercase tracking-wider px-3.5 py-2 rounded-xl border ${event.status === 'Published' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'}`}>
                            {event.status}
                          </span>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <button onClick={() => handleDelete(event._id)} className="p-3 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all">
                            <Trash2 size={20} />
                          </button>
                        </td>
                      </tr>
                    ))) : (
                        activeTab === 'events' && <tr><td colSpan="4" className="px-10 py-20 text-center text-slate-600 font-bold italic">No events found in registry.</td></tr>
                    )}

                    {/* Render Users */}
                    {activeTab === 'users' && users.length > 0 ? (
                      users
                      .filter(u => u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((user) => (
                      <tr key={user._id} className="hover:bg-blue-600/[0.03] transition-colors group">
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-white shadow-xl text-lg">
                                {user.name?.[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="font-black text-sm text-slate-100">{user.name}</p>
                              <p className="text-[10px] text-slate-500 font-bold mt-1.5 uppercase tracking-tighter italic">Platform Citizen</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-6 text-xs text-slate-400 font-black">{user.email}</td>
                        <td className="px-10 py-6">
                          <span className={`text-[9px] font-black uppercase tracking-wider px-3.5 py-2 rounded-xl border ${user.status === 'blocked' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                            {user.status || 'Active'}
                          </span>
                        </td>
                        <td className="px-10 py-6 text-right">
                             <ShieldCheck size={20} className="text-slate-700 ml-auto" />
                        </td>
                      </tr>
                    ))) : (
                        activeTab === 'users' && <tr><td colSpan="4" className="px-10 py-20 text-center text-slate-600 font-bold italic">No active users in current session.</td></tr>
                    )}

                    {/* Render Organizers */}
                    {activeTab === 'organizers' && organizers.length > 0 ? (
                      organizers
                      .filter(o => o.organizerName?.toLowerCase().includes(searchTerm.toLowerCase()) || o.organizerEmail?.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((org) => (
                      <tr key={org._id} className="hover:bg-blue-600/[0.03] transition-colors group">
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-black text-white shadow-xl">
                                <Briefcase size={20} />
                            </div>
                            <div>
                              <p className="font-black text-sm text-slate-100">{org.organizerName}</p>
                              <p className="text-[10px] text-slate-500 font-bold mt-1.5 uppercase tracking-tighter italic"><MapPin size={9} className="inline mr-1 text-emerald-500" /> {org.venue}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-6 text-xs text-slate-400 font-black">
                            <p>{org.organizerEmail}</p>
                            <p className="text-[10px] mt-1 text-slate-600/60 font-medium">{org.phoneNumber}</p>
                        </td>
                        <td className="px-10 py-6">
                          <span className="text-[9px] font-black uppercase tracking-wider px-3.5 py-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                            Partner Partner
                          </span>
                        </td>
                        <td className="px-10 py-6 text-right text-slate-500">
                           <ChevronRight size={22} className="ml-auto" />
                        </td>
                      </tr>
                    ))) : (
                        activeTab === 'organizers' && <tr><td colSpan="4" className="px-10 py-20 text-center text-slate-600 font-bold italic">No partners currently registered.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;