import React, { useState, useEffect } from "react";
import { History, Ticket, ShoppingBag, MapPin, Calendar as CalendarIcon, Package, CheckCircle2, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

const UserHistory = () => {
  const [activeTab, setActiveTab] = useState("tickets"); // "tickets" or "shop"
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/history/my-history", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success) {
          setBookings(response.data.bookings || []);
          setOrders(response.data.orders || []);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-white">
        <Loader2 className="animate-spin mb-4 text-blue-500" size={48} />
        <p className="text-slate-400 font-bold tracking-widest uppercase text-sm">Synchronizing your history...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-16 h-16 bg-blue-600/20 text-blue-500 rounded-2xl flex items-center justify-center">
            <History size={32} />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              My History
            </h1>
            <p className="text-slate-400">View your past purchases and upcoming booked tickets.</p>
          </div>
        </div>

        {/* Custom Tabs */}
        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setActiveTab("tickets")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === "tickets" 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                : "bg-[#161e2f] text-slate-400 hover:text-white"
            }`}
          >
            <Ticket size={20} /> Event Tickets
          </button>
          
          <button 
            onClick={() => setActiveTab("shop")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === "shop" 
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20" 
                : "bg-[#161e2f] text-slate-400 hover:text-white"
            }`}
          >
            <ShoppingBag size={20} /> Merchandise
          </button>
        </div>

        {/* Content Area */}
        {activeTab === "tickets" && (
          <div className="space-y-6">
            {bookings.length === 0 ? (
              <div className="text-center py-20 bg-[#161e2f]/30 rounded-[3rem] border border-white/5">
                <Ticket className="mx-auto text-slate-700 mb-4" size={64} />
                <p className="text-slate-500 font-bold">No ticket history found.</p>
                <Link to="/events" className="text-blue-500 hover:underline mt-2 inline-block">Browse Events</Link>
              </div>
            ) : (
              bookings.map((booking) => {
                const isPast = new Date(booking.event?.startDate) < new Date();
                return (
                  <div key={booking._id} className="bg-[#161e2f] border border-white/5 rounded-[2rem] overflow-hidden flex flex-col md:flex-row group transition-all hover:border-blue-500/30">
                    <div className="w-full md:w-56 h-48 md:h-auto overflow-hidden">
                      <img 
                        src={booking.event?.eventImage || "https://images.unsplash.com/photo-1540039155732-d68a268a7eb1?auto=format&fit=crop&w=800&q=80"} 
                        alt={booking.event?.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                    <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex gap-2">
                             <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${!isPast ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-500"}`}>
                               {!isPast ? "Upcoming" : "Past Event"}
                             </span>
                             {booking.status === "Confirmed" && (
                               <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                                 <CheckCircle2 size={10} /> Confirmed
                               </span>
                             )}
                          </div>
                          <span className="text-slate-600 font-mono text-[10px] bg-white/5 px-2 py-1 rounded-md">ID: {booking._id.slice(-6).toUpperCase()}</span>
                        </div>
                        <h3 className="text-2xl font-black mb-4 truncate">{booking.event?.title}</h3>
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-6">
                          <div className="flex items-center gap-2 text-slate-400 font-medium">
                            <CalendarIcon size={18} className="text-blue-500" /> {new Date(booking.event?.startDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2 text-slate-400 font-medium">
                            <MapPin size={18} className="text-red-500" /> {booking.event?.venueName}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-end pt-6 border-t border-white/5">
                        <div>
                          <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest mb-1">Quantity</p>
                          <p className="text-xl font-black">{booking.quantity} <span className="text-sm font-medium text-slate-400">Passes</span></p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest mb-1">Total Amount</p>
                          <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                            Rs. {booking.totalPaid}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === "shop" && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="text-center py-20 bg-[#161e2f]/30 rounded-[3rem] border border-white/5">
                <ShoppingBag className="mx-auto text-slate-700 mb-4" size={64} />
                <p className="text-slate-500 font-bold">No purchase history found.</p>
                <Link to="/shop" className="text-emerald-500 hover:underline mt-2 inline-block">Visit Shop</Link>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order._id} className="bg-[#161e2f] border border-white/5 p-6 md:p-8 rounded-[2rem]">
                  <div className="flex flex-col sm:flex-row justify-between items-center pb-6 border-b border-white/5 mb-6 gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
                        <Package size={24} />
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Order ID: <span className="font-mono text-white ml-2">ORD-{order._id.slice(-6).toUpperCase()}</span></p>
                        <p className="text-slate-500 text-sm mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-wider ${
                      (order.status === 'Confirmed' || order.status === 'Delivered') ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : 'bg-orange-500/10 text-orange-400'
                    }`}>
                      <CheckCircle2 size={14} /> {order.status}
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-slate-300 bg-[#0a0f1d] p-4 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-800 rounded-lg overflow-hidden border border-white/5">
                            <img src={item.product?.image} className="w-full h-full object-cover" alt="" />
                          </div>
                          <div>
                            <p className="font-bold">{item.product?.name || 'Deleted Product'}</p>
                            <p className="text-[10px] text-slate-500">Price: Rs. {item.price}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-500 font-medium text-xs">x {item.quantity}</span>
                          <p className="font-black text-white">Rs. {item.price * item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-4">
                    <span className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Grand Total</span>
                    <span className="text-2xl font-black text-white">Rs. {order.totalPaid}</span>
                  </div>
                </div>
              ))
            )}
            
            <div className="mt-8 text-center pt-10">
               <p className="text-slate-500 mb-6 text-sm">Want to grab some more merch?</p>
               <Link to="/shop" className="inline-block bg-white text-black font-black px-12 py-4 rounded-2xl hover:bg-slate-200 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/5">
                  Go to Shop
               </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserHistory;
