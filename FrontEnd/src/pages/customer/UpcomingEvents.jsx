import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, MapPin, Ticket, Clock, Loader2, AlertCircle } from "lucide-react";

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/all");
        
        // Debugging: Check what the backend is actually sending
        console.log("Backend Response:", res.data);

        // Safety Check: Extract the array regardless of format
        const eventArray = Array.isArray(res.data) 
          ? res.data 
          : res.data.events || res.data.data || [];

        // Filter: Start date is today or in the future
        const now = new Date();
        const upcoming = eventArray.filter(event => new Date(event.startDate) >= now);
        
        setEvents(upcoming);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-500" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#121212] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Upcoming Events
          </h1>
          <p className="text-slate-400 mt-2 text-lg">Don't miss out on the latest experiences.</p>
        </header>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl flex items-center gap-3 text-red-400 mb-8">
            <AlertCircle size={20} /> {error}
          </div>
        )}

        {events.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
            <Calendar size={64} className="mx-auto text-slate-600 mb-4" />
            <p className="text-xl text-slate-400">No upcoming events found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div key={event._id} className="bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all group shadow-xl flex flex-col">
                
                {/* --- UPDATED IMAGE SECTION --- */}
                <div className="h-48 bg-slate-800 relative overflow-hidden">
                  {event.eventImage ? (
                    <img 
                      src={event.eventImage} 
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => { 
                        // If Cloudinary URL fails, try localhost fallback or placeholder
                        e.target.src = "https://via.placeholder.com/400x200?text=Event+Image"; 
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-700">
                      <span className="text-slate-400">No Image Available</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent opacity-60"></div>
                  <span className="absolute top-4 left-4 bg-blue-600 text-[10px] font-black uppercase px-3 py-1 rounded-full z-10">
                    {event.category || "Event"}
                  </span>
                </div>
                {/* ------------------------------ */}
                
                <div className="p-6 space-y-4 flex-1 flex flex-col">
                  <h2 className="text-2xl font-bold group-hover:text-blue-400 transition-colors">{event.title}</h2>
                  
                  <div className="space-y-2 text-slate-400 text-sm flex-1">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-blue-500" />
                      {new Date(event.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-blue-500" />
                      {event.venueName}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                    <span className="text-xl font-bold text-emerald-400">
                      {event.ticketPrice > 0 ? `Rs. ${event.ticketPrice}` : "FREE"}
                    </span>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-bold transition active:scale-95">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingEvents;