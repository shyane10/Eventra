import React, { useState, useEffect } from "react";
import axios from "axios";
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
  PackagePlus,
  ShieldCheck,
  CheckCircle2,
  Edit3,
  Trash2
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const OrganizerDB = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [organizer, setOrganizer] = useState(null);
  
  // Dynamic State
  const [myEvents, setMyEvents] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [revenueHistory, setRevenueHistory] = useState([]); // New state for line graph
  const [dashboardStats, setDashboardStats] = useState({
    ticketRevenue: 0,
    productRevenue: 0,
    eventCount: 0,
    totalOrganizerShare: 0,
    availableBalance: 0,
    receivedRevenue: 0,
    totalAttendees: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(false);

  // 1. Load organizer data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user") || localStorage.getItem("Organizer");
    if (storedUser) {
      setOrganizer(JSON.parse(storedUser));
    } else {
      navigate("/");
    }
  }, [navigate]);

  // 1b. Fetch Data based on Tab
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      setLoading(true);
      try {
        if (activeTab === "events" || activeTab === "dashboard") {
          const res = await axios.get("http://localhost:5000/api/events/my-events", {
            headers: { Authorization: `Bearer ${token}` }
          });
          setMyEvents(res.data.events || []);
        }
        
        if (activeTab === "attendees" || activeTab === "dashboard") {
          const res = await axios.get("http://localhost:5000/api/history/attendees", {
            headers: { Authorization: `Bearer ${token}` }
          });
          setAttendees(res.data.attendees || []);
        }

        if (activeTab === "dashboard") {
          const statsRes = await axios.get("http://localhost:5000/api/history/organizer-stats", {
            headers: { Authorization: `Bearer ${token}` }
          });
          setDashboardStats(statsRes.data.stats);

          const res = await axios.get("http://localhost:5000/api/history/revenue-analytics", {
            headers: { Authorization: `Bearer ${token}` }
          });
          // Format data for stock-style graph (cumulative or time-series)
          const rawData = res.data.data || [];
          const formatted = rawData.map(d => ({
             date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
             revenue: d.amount
          }));
          setRevenueHistory(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch organizer data", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [activeTab]);

  // 2. LOGOUT HANDLER
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out from the Organizer Panel?");
    if (confirmLogout) {
      localStorage.clear();
      navigate("/"); 
    }
  };

  // DYNAMIC STATS CALCULATION
  const totalEventsCount = myEvents.length;
  const totalBookingsCount = attendees.reduce((acc, curr) => acc + (curr.quantity || 1), 0);
  const totalRevenue = attendees.reduce((acc, curr) => acc + (curr.totalPaid || 0), 0);

  const stats = [
    { label: "Total Events", value: (dashboardStats.eventCount || 0).toString(), icon: <CalendarDays className="text-blue-500" /> },
    { label: "Total Bookings", value: (dashboardStats.totalAttendees || 0).toString(), icon: <Users className="text-purple-500" /> },
    { label: "Ticket Revenue", value: `Rs. ${(dashboardStats.ticketRevenue || 0).toLocaleString()}`, icon: <BarChart3 className="text-green-500" /> },
    { label: "Product Revenue", value: `Rs. ${(dashboardStats.productRevenue || 0).toLocaleString()}`, icon: <PackagePlus className="text-emerald-500" /> },
    { label: "Your 30% Share", value: `Rs. ${(dashboardStats.totalOrganizerShare || 0).toLocaleString()}`, icon: <ShieldCheck className="text-blue-400" /> },
    { label: "Available to Request", value: `Rs. ${(dashboardStats.availableBalance || 0).toLocaleString()}`, icon: <PlusCircle className="text-orange-500" /> },
    { label: "Received from Admin", value: `Rs. ${(dashboardStats.receivedRevenue || 0).toLocaleString()}`, icon: <CheckCircle2 className="text-emerald-400" /> },
  ];

  const handleRequestPayout = async () => {
    if (dashboardStats.availableBalance <= 0) {
      alert("No available balance to request.");
      return;
    }
    
    if (!window.confirm(`Request a payout of Rs. ${dashboardStats.availableBalance}?`)) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/history/request-payout", 
        { amount: dashboardStats.availableBalance },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      alert("Payout request submitted to Admin!");
      window.location.reload(); 
    } catch (err) {
      alert("Failed to submit request.");
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm("Permanently delete this event?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/events/deleteEvent/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMyEvents(myEvents.filter(e => e._id !== id));
      } catch (err) {
        alert("Action failed.");
      }
    }
  };


  // PREPARE GRAPH DATA (Revenue by Event)
  const calculateGraphData = () => {
    if (!attendees || attendees.length === 0) return [];
    
    const eventSales = {};
    attendees.forEach(booking => {
      const eventName = booking.event?.title || 'Unknown';
      if (!eventSales[eventName]) eventSales[eventName] = 0;
      eventSales[eventName] += (booking.totalPaid || 0);
    });

    const graphData = Object.keys(eventSales).map(key => ({
      name: key,
      revenue: eventSales[key]
    }));

    // Find max for scaling
    const maxRev = Math.max(...graphData.map(d => d.revenue), 1);
    
    return graphData.map(d => ({
      ...d,
      heightPercentage: (d.revenue / maxRev) * 100
    }));
  };

  const chartData = calculateGraphData();

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
            <PackagePlus size={20} /> My Products
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
            
            {/* ACTION: REQUEST PAYOUT BUTTON */}
            <button 
              onClick={handleRequestPayout}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-orange-500/20 transition-all active:scale-95"
            >
              <ShieldCheck size={20} /> Request Payout
            </button>

            {/* ACTION: CREATE PRODUCT BUTTON */}
            <button 
              onClick={() => navigate("/create-product")}
              className="flex items-center gap-2 px-6 py-3.5 bg-[#1e293b] hover:bg-[#2d3a4f] text-white rounded-2xl font-bold transition-all border border-white/5 shadow-xl active:scale-95 cursor-pointer"
            >
              <PackagePlus size={18} className="text-blue-400" />
              <span>Add Product</span>
            </button>

            {/* ACTION: CREATE EVENT BUTTON */}
            <button 
              onClick={() => navigate("/create-event")}
              className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] active:scale-95 cursor-pointer"
            >
              <PlusCircle size={18} />
              <span>Add Event</span>
            </button>
          </div>
        </header>

        {/* Tab Content Logic */}
        {activeTab === "dashboard" && (
          <>
            {/* Combined Total Floating Header */}
            <div className="bg-gradient-to-r from-blue-600 to-emerald-500 p-8 rounded-3xl mb-10 shadow-2xl flex justify-between items-center overflow-hidden relative group">
               <div className="relative z-10">
                  <p className="text-blue-100 text-xs font-black uppercase tracking-[0.2em] mb-2">Platform Power Balance</p>
                  <h3 className="text-4xl font-black text-white">Rs. {(dashboardStats.totalRevenue || 0).toLocaleString()}</h3>
                  <p className="text-blue-100/70 text-sm mt-2 font-medium">Total combined revenue from all your events & merchandise.</p>
               </div>
               <div className="p-5 bg-white/10 rounded-2xl relative z-10 backdrop-blur-md">
                  <BarChart3 className="text-white" size={40} />
               </div>
               {/* Pattern Overlay */}
               <div className="absolute top-0 right-0 w-64 h-full bg-white/5 skew-x-12 transform translate-x-32 group-hover:translate-x-24 transition-transform duration-700"></div>
            </div>

            {/* Stats Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-blue-500/30 transition-all duration-300 group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 group-hover:border-blue-500/50 transition-colors">
                      {stat.icon}
                    </div>
                  </div>
                  <h3 className="text-slate-500 font-semibold mb-1 uppercase text-xs tracking-wider">{stat.label}</h3>
                  <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
                </div>
              ))}
            </section>

            {/* REVENUE GRAPH VIEW (Stock Market Style) */}
            <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl mb-10 overflow-hidden">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Market Performance</h3>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Real-time revenue growth from Events & Merch</p>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                   <span className="text-blue-500 text-[10px] font-black uppercase tracking-widest">Live Data</span>
                </div>
              </div>
              
              <div className="h-80 w-full mt-4">
                {revenueHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full bg-slate-950/50 rounded-2xl border border-dashed border-slate-800">
                    <BarChart3 size={48} className="text-slate-600 mb-4" />
                    <p className="text-slate-400 font-medium">No sales data available to plot yet.</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueHistory}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#475569" 
                        fontSize={10} 
                        fontWeight="bold" 
                        tickLine={false} 
                        axisLine={false}
                        dy={10}
                      />
                      <YAxis 
                        stroke="#475569" 
                        fontSize={10} 
                        fontWeight="bold" 
                        tickLine={false} 
                        axisLine={false} 
                        tickFormatter={(value) => `Rs.${value}`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0f172a', 
                          border: '1px solid #1e293b',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          color: '#fff'
                        }}
                        itemStyle={{ color: '#60a5fa' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#3b82f6" 
                        strokeWidth={4}
                        fillOpacity={1} 
                        fill="url(#colorRevenue)" 
                        animationDuration={2000}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </section>
          </>
        )}

        {/* Dynamic Tabs Logic */}
        {activeTab === "events" && (
          <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                <h3 className="text-xl font-bold text-white">All My Events</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-950/50 text-slate-500 text-[10px] uppercase tracking-[2px] font-black">
                      <th className="px-6 py-5">Event Name</th>
                      <th className="px-6 py-5">Date</th>
                      <th className="px-6 py-5">Venue</th>
                      <th className="px-6 py-5">Status</th>
                      <th className="px-6 py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {loading ? (
                       <tr><td colSpan="4" className="text-center py-6">Loading...</td></tr>
                    ) : myEvents.length === 0 ? (
                       <tr><td colSpan="4" className="text-center py-6 text-slate-500">No events created yet.</td></tr>
                    ) : (
                      myEvents.map(event => (
                        <tr key={event._id} className="hover:bg-slate-800/30 transition-colors group">
                          <td className="px-6 py-5 font-bold text-white">{event.title}</td>
                          <td className="px-6 py-5 text-slate-400 text-sm">{new Date(event.startDate).toLocaleDateString()}</td>
                          <td className="px-6 py-5 text-slate-400 text-sm">{event.venueName}</td>
                          <td className="px-6 py-5">
                            <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg border ${event.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : event.status === 'Rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'}`}>
                              {event.status || 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right">
                             <div className="flex items-center justify-end gap-2">
                               <button 
                                 onClick={() => navigate("/create-event", { state: { event } })}
                                 className="p-2 bg-white/5 hover:bg-blue-600 text-slate-300 rounded-lg transition-colors"
                               >
                                 <Edit3 size={16} />
                               </button>
                               <button 
                                 onClick={() => handleDeleteEvent(event._id)}
                                 className="p-2 bg-white/5 hover:bg-red-600 text-slate-300 rounded-lg transition-colors"
                               >
                                 <Trash2 size={16} />
                               </button>
                             </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
          </section>
        )}

        {activeTab === "attendees" && (
          <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                <h3 className="text-xl font-bold text-white">Registered Attendees</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-950/50 text-slate-500 text-[10px] uppercase tracking-[2px] font-black">
                      <th className="px-6 py-5">User Name</th>
                      <th className="px-6 py-5">Email</th>
                      <th className="px-6 py-5">Event Booked</th>
                      <th className="px-6 py-5">Quantity</th>
                      <th className="px-6 py-5">Total Paid</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {loading ? (
                       <tr><td colSpan="5" className="text-center py-6">Loading...</td></tr>
                    ) : attendees.length === 0 ? (
                       <tr><td colSpan="5" className="text-center py-6 text-slate-500">No attendees have booked yet.</td></tr>
                    ) : (
                      attendees.map(booking => (
                        <tr key={booking._id} className="hover:bg-slate-800/30 transition-colors group">
                          <td className="px-6 py-5 font-bold text-white">{booking.user?.name || 'Unknown User'}</td>
                          <td className="px-6 py-5 text-slate-400 text-sm">{booking.user?.email || 'N/A'}</td>
                          <td className="px-6 py-5 text-slate-400 font-medium">{booking.event?.title || 'Unknown Event'}</td>
                          <td className="px-6 py-5 text-blue-400 font-mono font-bold">{booking.quantity}</td>
                          <td className="px-6 py-5 text-green-400 font-mono font-bold">Rs. {booking.totalPaid}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
          </section>
        )}

        {activeTab === "settings" && (
            <div className="flex flex-col items-center justify-center p-10 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl">
               <h3 className="text-2xl font-bold text-white mb-6">Organizer Settings</h3>
               <div className="w-full max-w-md space-y-4">
                 <div>
                   <label className="block text-slate-400 text-xs font-bold uppercase mb-2">Organizer Email</label>
                   <input type="text" disabled value={organizer?.organizerEmail || organizer?.email || ''} className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-slate-300" />
                 </div>
                 <div>
                   <label className="block text-slate-400 text-xs font-bold uppercase mb-2">Organizer Name</label>
                   <input type="text" disabled value={organizer?.organizerName || organizer?.name || ''} className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-slate-300" />
                 </div>
                 <p className="text-slate-500 text-sm mt-4 italic">Note: Settings update feature is coming soon.</p>
               </div>
            </div>
        )}
      </main>
    </div>
  );
};

export default OrganizerDB;