import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, MapPin, Ticket, Clock, Loader2, AlertCircle, X, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/events/all");
        
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
                <div 
                  className="h-48 bg-slate-800 relative overflow-hidden cursor-pointer"
                  onClick={() => navigate('/booking', { state: { event } })}
                >
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
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="bg-white text-slate-900 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-[2px] shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      Book Now
                    </span>
                  </div>
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
                    <button 
                      onClick={() => setSelectedEvent(event)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-bold transition active:scale-95"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- EVENT DETAILS MODAL --- */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedEvent(null)}
          ></div>
          
          <div className="relative bg-[#1a1a1a] border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in fade-in zoom-in duration-300">
            {/* Modal Image */}
            <div className="md:w-1/2 h-64 md:h-auto relative bg-slate-800">
              <img 
                src={selectedEvent.eventImage || "https://via.placeholder.com/600x800?text=Event+Image"} 
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = "https://via.placeholder.com/600x800?text=Event+Image"; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] md:from-transparent to-transparent"></div>
              <button 
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-md transition-colors md:hidden"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="md:w-1/2 p-8 flex flex-col max-h-[90vh] overflow-y-auto">
              <div className="hidden md:flex justify-end mb-2">
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <span className="inline-block bg-blue-500/20 text-blue-400 text-xs font-bold uppercase px-3 py-1 rounded-full w-max mb-4">
                {selectedEvent.category || "Event"}
              </span>

              <h2 className="text-3xl font-extrabold text-white mb-2">{selectedEvent.title}</h2>
              
              <div className="flex items-center gap-2 text-xl font-bold text-emerald-400 mb-6">
                <span>{selectedEvent.ticketPrice > 0 ? `Rs. ${selectedEvent.ticketPrice}` : "FREE"}</span>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="bg-white/5 p-3 rounded-xl text-blue-500">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Date</p>
                    <p className="font-medium text-white">
                      {new Date(selectedEvent.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white/5 p-3 rounded-xl text-purple-500">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Time</p>
                    <p className="font-medium text-white">{selectedEvent.time || "TBA"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white/5 p-3 rounded-xl text-rose-500">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Venue</p>
                    <p className="font-medium text-white">{selectedEvent.venueName}</p>
                    {selectedEvent.googleMapsUrl && (
                       <a href={selectedEvent.googleMapsUrl} target="_blank" rel="noreferrer" className="text-blue-400 text-sm hover:underline mt-1 inline-block">
                         View on Map
                       </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-8 flex-1">
                <h3 className="text-lg font-bold text-white mb-3">About this event</h3>
                <p className="text-slate-400 leading-relaxed text-sm whitespace-pre-wrap">
                  {selectedEvent.description || "No description available for this event."}
                </p>
              </div>

              <div className="mt-auto pt-6 border-t border-white/10 flex gap-4">
                <button 
                  onClick={() => {
                    navigate('/booking', { state: { event: selectedEvent } });
                  }} 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
                >
                  <Ticket size={20} />
                  Book Tickets Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingEvents;