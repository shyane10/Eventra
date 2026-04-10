import React, { useState, useEffect } from "react";
import axios from "axios";
import { History, MapPin, Loader2, Camera } from "lucide-react";

const PastEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/all");
        
        const eventArray = Array.isArray(res.data) 
          ? res.data 
          : res.data.events || res.data.data || [];

        const now = new Date();
        const past = eventArray.filter(event => new Date(event.endDate) < now);
        
        setEvents(past);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center">
      <Loader2 className="animate-spin text-slate-500" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#121212] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-slate-500">Past Events</h1>
          <p className="text-slate-600 mt-2 text-lg">Memories from our previous gatherings.</p>
        </header>

        {events.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
            <History size={64} className="mx-auto text-slate-800 mb-4" />
            <p className="text-xl text-slate-600">No history of past events found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div key={event._id} className="bg-[#1a1a1a] border border-white/5 rounded-2xl overflow-hidden opacity-60 grayscale hover:grayscale-0 transition-all duration-700 group">
                <div className="h-40 bg-slate-900 flex items-center justify-center relative">
                   <Camera size={32} className="text-white/5" />
                   <div className="absolute top-4 right-4 bg-black/60 px-3 py-1 rounded text-[10px] font-bold text-slate-400">
                     ENDED
                   </div>
                </div>
                
                <div className="p-6">
                  <h2 className="text-xl font-bold text-slate-300 group-hover:text-white transition-colors">{event.title}</h2>
                  <p className="text-slate-500 text-sm mt-2 flex items-center gap-2">
                    <MapPin size={14} /> {event.venueName}
                  </p>
                  <div className="mt-4 pt-4 border-t border-white/5 text-[10px] uppercase tracking-widest text-slate-600 font-bold">
                    Concluded on {new Date(event.endDate).toLocaleDateString()}
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

export default PastEvents;