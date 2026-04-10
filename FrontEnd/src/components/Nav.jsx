import React, { useState } from "react";
import { Menu, X, User, Book, Home, Info, Mail, ShoppingBag, ChevronDown, Calendar, History, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../image/image.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [eventsDropdown, setEventsDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Hide Navbar on Auth pages
  const hideNavbarPaths = ["/", "/register", "/verify-otp"];
  if (hideNavbarPaths.includes(location.pathname)) return null;

  const isActive = (path) => (location.pathname === path ? "text-blue-500" : "text-white");

  // --- LOGOUT HANDLER ---
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.clear(); // Clears token, role, and user data
      alert("Logged out successfully!");
      navigate("/"); // Redirect to Login page
    }
  };

  return (
    <nav className="bg-[#1a1a1a] text-white shadow-md sticky top-0 z-50 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-32 gap-2">
          
          {/* Left Side Links */}
          <div className="hidden md:flex items-center space-x-6 flex-1 flex-nowrap">
            <Link to="/home" className={`flex items-center gap-2 hover:text-blue-500 text-xl font-bold transition whitespace-nowrap ${isActive('/home')}`}>
              <Home size={22} /> Home
            </Link>

            {/* Events Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setEventsDropdown(true)}
              onMouseLeave={() => setEventsDropdown(false)}
            >
              <button className={`flex items-center gap-2 hover:text-blue-500 text-xl font-bold transition py-12 whitespace-nowrap ${isActive('/events')}`}>
                Events <ChevronDown size={20} className={`transition-transform duration-200 ${eventsDropdown ? "rotate-180" : ""}`} />
              </button>

              {eventsDropdown && (
                <div className="absolute top-[90px] left-0 w-56 bg-[#242424] border border-white/10 rounded-xl shadow-2xl py-2 z-50">
                  <Link to="/events/upcoming" className="flex items-center gap-3 px-5 py-3 hover:bg-white/5 hover:text-blue-400 transition text-lg">
                    <Calendar size={20} /> Upcoming Events
                  </Link>
                  <Link to="/events/past" className="flex items-center gap-3 px-5 py-3 hover:bg-white/5 hover:text-slate-400 transition text-lg">
                    <History size={20} /> Past Events
                  </Link>
                </div>
              )}
            </div>

           
          </div>

          {/* Center: Logo */}
          <div className="flex-shrink-0 flex justify-center items-center h-32 w-[280px]">
            <Link to="/home" className="h-full w-full flex items-center justify-center overflow-hidden">
              <img
                className="h-[120%] w-full object-contain transform transition-transform duration-300 hover:scale-105"
                src={logo}
                alt="Eventra Logo"
              />
            </Link>
          </div>

          {/* Right Side Links */}
          <div className="hidden md:flex items-center justify-end space-x-5 flex-1 flex-nowrap">
            <Link to="/shop" className={`flex items-center gap-2 hover:text-blue-500 text-xl font-bold transition whitespace-nowrap ${isActive('/shop')}`}>
              <ShoppingBag size={22} /> Shop
            </Link>

             <Link to="/booking" className={`flex items-center gap-2 hover:text-blue-500 text-xl font-bold transition whitespace-nowrap ${isActive('/booking')}`}>
              Book <Book size={22} />
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-red-600/10 text-red-500 border border-red-500/20 px-5 py-2.5 rounded-full font-bold hover:bg-red-600 hover:text-white transition flex items-center gap-2 whitespace-nowrap text-lg"
            >
              <LogOut size={22} /> Logout
            </button>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-blue-500">
              {isOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#1a1a1a] border-t border-white/10 pb-6">
          <div className="px-4 pt-4 space-y-2">
            <Link to="/home" className="flex items-center gap-4 px-3 py-4 text-white text-xl font-bold hover:bg-white/5 rounded-lg" onClick={() => setIsOpen(false)}><Home size={24} /> Home</Link>
            <Link to="/booking" className="flex items-center gap-4 px-3 py-4 text-white text-xl font-bold hover:bg-white/5 rounded-lg" onClick={() => setIsOpen(false)}><Book size={24} /> Book Tickets</Link>
            <Link to="/shop" className="flex items-center gap-4 px-3 py-4 text-white text-xl font-bold hover:bg-white/5 rounded-lg" onClick={() => setIsOpen(false)}><ShoppingBag size={24} /> Shop</Link>
            <Link to="/contact" className="flex items-center gap-4 px-3 py-4 text-white text-xl font-bold hover:bg-white/5 rounded-lg" onClick={() => setIsOpen(false)}><Mail size={24} /> Contact</Link>
            
            <div className="pt-4 px-3">
              <button 
                onClick={handleLogout}
                className="w-full bg-red-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-xl"
              >
                <LogOut size={28} /> Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;