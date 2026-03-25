import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      title: "One Platform. All Your Events.",
      subtitle: "Discover the most anticipated concerts and festivals in Nepal.",
      btnText: "Explore Now",
      image: "https://images.unsplash.com/photo-1459749411177-042180ce673c?q=80&w=2070",
      tag: "FEATURED"
    },
    {
      title: "Host Your Own Experience.",
      subtitle: "Join 500+ organizers managing events with Eventra tools.",
      btnText: "Start Organizing",
      image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070",
      tag: "FOR ORGANIZERS"
    },
    {
      title: "Exclusive Tech Summits.",
      subtitle: "Book your seats for the biggest 2026 Networking events.",
      btnText: "View Schedule",
      image: "https://images.unsplash.com/photo-1540575861501-7ad0582371f3?q=80&w=2070",
      tag: "TECH 2026"
    }
  ];

  const featuredEvents = [
    { title: "Tech Conference 2026", date: "12 June", location: "Kathmandu", image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678" },
    { title: "Music Festival", date: "28 July", location: "Pokhara", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745" },
    { title: "Startup Meetup", date: "5 Aug", location: "Lalitpur", image: "https://images.unsplash.com/photo-1511578314322-379afb476865" },
  ];

  // Auto-play logic (optional)
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [activeSlide]);

  const nextSlide = () => setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      
      {/* Sidebar Trigger */}
      <button 
        onClick={() => setMenuOpen(true)}
        className="fixed top-6 right-6 z-50 bg-white shadow-xl p-4 rounded-2xl hover:scale-110 transition-transform border border-slate-100"
      >
        <div className="space-y-1.5">
          <span className="block w-6 h-0.5 bg-blue-600"></span>
          <span className="block w-6 h-0.5 bg-blue-600"></span>
          <span className="block w-4 h-0.5 bg-blue-600"></span>
        </div>
      </button>

      {/* Sidebar Menu */}
      <div className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-[60] transform ${menuOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 border-r border-slate-100`}>
        <div className="flex justify-between items-center px-8 py-6 border-b">
          <h2 className="text-2xl font-black text-blue-600">EVENTRA</h2>
          <button onClick={() => setMenuOpen(false)} className="text-slate-400 text-2xl font-light">✕</button>
        </div>
        
      </div>

      {/* Banner Slider Section */}
      <header className="px-6 pt-10 pb-6">
        <div className="max-w-7xl mx-auto relative group h-[500px] md:h-[600px] overflow-hidden rounded-[3rem] shadow-2xl">
          
          {/* Main Slide Card */}
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === activeSlide ? "opacity-100 z-10" : "opacity-0 z-0"}`}
              style={{
                backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.2)), url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="h-full flex flex-col justify-center p-12 md:p-20 text-white">
                <div className="relative z-10 max-w-2xl">
                  <span className="bg-blue-600/80 backdrop-blur-md px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase mb-6 inline-block">
                    {slide.tag}
                  </span>
                  <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl text-white/90 mb-10 font-medium max-w-lg">
                    {slide.subtitle}
                  </p>
                  <button className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-black hover:bg-blue-50 transition-all active:scale-95 shadow-lg">
                    {slide.btnText}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Slider Controls (Arrows) */}
          <button onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full backdrop-blur-md z-20 opacity-0 group-hover:opacity-100 transition-opacity">
             <span className="text-2xl text-white">←</span>
          </button>
          <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full backdrop-blur-md z-20 opacity-0 group-hover:opacity-100 transition-opacity">
             <span className="text-2xl text-white">→</span>
          </button>

          {/* Pagination Dots */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
            {slides.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setActiveSlide(i)}
                className={`h-2 rounded-full transition-all duration-300 ${activeSlide === i ? "w-8 bg-white" : "w-2 bg-white/40"}`}
              ></button>
            ))}
          </div>
        </div>
      </header>

      {/* Featured Events Grid */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-4xl font-black text-slate-800 tracking-tight mb-10 text-center">Upcoming Events</h2>
        
        <div className="grid md:grid-cols-3 gap-10">
          {featuredEvents.map((event, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-[2.5rem] shadow-sm mb-6 border border-slate-100">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="h-72 w-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-xs font-black text-blue-600">
                  {event.date}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">{event.title}</h3>
              <p className="text-slate-500 font-bold flex items-center gap-2">
                <span className="text-blue-500">📍</span> {event.location}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-20 text-center border-t border-slate-100 mt-10">
        <h2 className="text-2xl font-black text-blue-600 italic tracking-tighter">EVENTRA</h2>
        <p className="text-slate-400 mt-2 font-medium">Your gateway to the best experiences in Nepal.</p>
      </footer>
    </div>
  );
};

export default Home;