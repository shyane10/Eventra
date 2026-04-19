import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Added axios

const Home = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  // --- NEW STATE FOR DYNAMIC EVENTS ---
  const [dynamicEvents, setDynamicEvents] = useState([]);
  const [dynamicProducts, setDynamicProducts] = useState([]); // New state for products
  const [loading, setLoading] = useState(true);

  // 1. DYNAMIC SLIDES CALCULATION
  const getSlides = () => {
    const baseSlides = [
      {
        title: dynamicEvents[0]?.title || "One Platform. All Your Events.",
        subtitle: dynamicEvents[0]?.description ? (dynamicEvents[0].description.substring(0, 100) + '...') : "Discover the most anticipated concerts and festivals in Nepal.",
        btnText: dynamicEvents[0] ? "Book Now" : "Explore Now",
        image: dynamicEvents[0]?.eventImage || "https://images.unsplash.com/photo-1459749411177-042180ce673c?q=80&w=2070",
        tag: dynamicEvents[0] ? "DYNAMNIC HIGHLIGHT" : "FEATURED",
        link: dynamicEvents[0] ? "/booking" : "/events/upcoming",
        eventData: dynamicEvents[0] // Pass the full event object
      },
      {
        title: "Host Your Own Experience.",
        subtitle: "Join 500+ organizers managing events with Eventra tools.",
        btnText: "Start Organizing",
        image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070",
        tag: "FOR ORGANIZERS",
        link: "organizer-logic" // Special flag
      },
      {
        title: "Exclusive Merchandise Shop",
        subtitle: "One-click checkout for exclusive artist drops and band tees.",
        btnText: "Go to Shop",
        image: dynamicProducts[0]?.image || "https://images.unsplash.com/photo-1514525253361-b83f859b73c0?q=80&w=2070",
        tag: "OFFICIAL SHOP",
        link: "/shop"
      }
    ];
    return baseSlides;
  };

  const slides = getSlides();

  // --- FETCH DYNAMIC EVENTS LOGIC ---
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [eventRes, productRes] = await Promise.all([
          axios.get("http://localhost:5000/api/events/all"),
          axios.get("http://localhost:5000/api/products")
        ]);

        // Process Events
        const eventArray = Array.isArray(eventRes.data) 
          ? eventRes.data 
          : eventRes.data.events || eventRes.data.data || [];
        const now = new Date();
        const upcoming = eventArray
          .filter(event => new Date(event.startDate) >= now)
          .slice(0, 3);
        setDynamicEvents(upcoming);

        // Process Products
        const productArray = Array.isArray(productRes.data) ? productRes.data : [];
        setDynamicProducts(productArray);

      } catch (err) {
        console.error("Error loading home data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  // Auto-play logic
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [activeSlide]);

  const nextSlide = () => setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  // --- BUTTON ACTION HANDLER ---
  const handleSlideAction = (slide) => {
    const { link, eventData } = slide;
    
    if (link === "organizer-logic") {
      const role = localStorage.getItem("role");
      if (role === "organizer") {
        navigate("/organizer-home");
      } else {
        alert("Please login as an Organizer to access the Dashboard.");
        navigate("/"); 
      }
    } else if (link === "/booking" && eventData) {
      // Pass the event object into the booking state
      navigate(link, { state: { event: eventData } });
    } else {
      navigate(link);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      
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
                  <button 
                    onClick={() => handleSlideAction(slide)}
                    className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-black hover:bg-blue-50 transition-all active:scale-95 shadow-lg border-2 border-transparent hover:border-blue-600/20"
                  >
                    {slide.btnText}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Slider Controls */}
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

      {/* Featured Events Grid - NOW DYNAMIC */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-4xl font-black text-slate-800 tracking-tight mb-10 text-center">Upcoming Events</h2>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-10">
            {dynamicEvents.length > 0 ? (
              dynamicEvents.map((event, i) => (
                <div key={i} className="group cursor-pointer" onClick={() => navigate(`/booking`, { state: { event } })}>
                  <div className="relative overflow-hidden rounded-[2.5rem] shadow-sm mb-6 border border-slate-100">
                    <img 
                      // Updated to use dynamic image path (Cloudinary)
                      src={event.eventImage} 
                      alt={event.title} 
                      className="h-72 w-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1501386761578-eac5c94b800a"; }}
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="bg-white text-slate-900 px-6 py-2.5 rounded-xl font-black text-sm uppercase tracking-widest shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        Book Now
                      </span>
                    </div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-xs font-black text-blue-600 shadow-lg">
                      {new Date(event.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {event.title}
                  </h3>
                  <p className="text-slate-500 font-bold flex items-center gap-2">
                    <span className="text-blue-500">📍</span> {event.venueName || "Nepal"}
                  </p>
                </div>
              ))
            ) : (
              <p className="col-span-3 text-center text-slate-400 py-10 font-medium">No events found at the moment.</p>
            )}
          </div>
        )}
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