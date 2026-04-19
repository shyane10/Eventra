import React, { useState } from "react";
import { Menu, X, User, Book, Home, Info, Mail, ShoppingBag, ShoppingCart, ChevronDown, Calendar, History, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../image/image.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [eventsDropdown, setEventsDropdown] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Read auth data safely
  const authRole = localStorage.getItem("role");
  let authProfile = null;
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) authProfile = JSON.parse(userStr);
  } catch (e) {}

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
    <nav className="bg-[#1a1a1a]/80 backdrop-blur-md text-white shadow-lg sticky top-0 z-50 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 gap-8">
          
          {/* Left Side Links */}
          <div className="hidden md:flex items-center space-x-8 flex-1">
            <Link to="/home" className={`flex items-center gap-2 hover:text-blue-500 text-sm font-bold uppercase tracking-widest transition whitespace-nowrap ${isActive('/home')}`}>
              <Home size={18} /> Home
            </Link>

            {/* Events Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setEventsDropdown(true)}
              onMouseLeave={() => setEventsDropdown(false)}
            >
              <button className={`flex items-center gap-2 hover:text-blue-500 text-sm font-bold uppercase tracking-widest transition py-8 whitespace-nowrap ${isActive('/events')}`}>
                Events <ChevronDown size={16} className={`transition-transform duration-200 ${eventsDropdown ? "rotate-180" : ""}`} />
              </button>

              {eventsDropdown && (
                <div className="absolute top-16 left-0 w-52 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link to="/events/upcoming" className="flex items-center gap-3 px-5 py-3 hover:bg-white/5 hover:text-blue-400 transition text-sm font-medium border-b border-white/5">
                    <Calendar size={16} /> Upcoming Events
                  </Link>
                  <Link to="/events/past" className="flex items-center gap-3 px-5 py-3 hover:bg-white/5 hover:text-slate-400 transition text-sm font-medium">
                    <History size={16} /> Past Events
                  </Link>
                </div>
              )}
            </div>

            <Link to="/shop" className={`flex items-center gap-2 hover:text-blue-500 text-sm font-bold uppercase tracking-widest transition whitespace-nowrap ${isActive('/shop')}`}>
              <ShoppingBag size={18} /> Shop
            </Link>
           
          </div>

          {/* Center: Logo */}
          <div className="flex-shrink-0 flex justify-center items-center h-20 w-[180px]">
            <Link to="/home" className="h-full w-full flex items-center justify-center">
              <img
                className="h-12 w-auto object-contain transform transition-transform duration-300 hover:scale-105"
                src={logo}
                alt="Eventra Logo"
              />
            </Link>
          </div>

          {/* Right Side Links */}
          <div className="hidden md:flex items-center justify-end space-x-8 flex-1">
             <Link to="/booking" className={`flex items-center gap-2 hover:text-blue-500 text-sm font-bold uppercase tracking-widest transition whitespace-nowrap ${isActive('/booking')}`}>
              Book <Book size={18} />
            </Link>

            <Link to="/category" className={`flex items-center gap-2 hover:text-blue-500 text-sm font-bold uppercase tracking-widest transition whitespace-nowrap ${isActive('/category')}`}>
              <ShoppingCart size={18} /> Cart
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-red-600/10 text-red-500 border border-red-500/20 px-4 py-2 rounded-full font-bold hover:bg-red-600 hover:text-white transition flex items-center gap-2 whitespace-nowrap text-xs uppercase tracking-widest"
            >
              <LogOut size={16} /> Logout
            </button>

            {/* Profile Section (Right side of Logout) */}
            {authProfile && (
              <div className="relative">
                <div 
                  onClick={() => setProfileDropdown(!profileDropdown)}
                  className="flex items-center gap-3 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full select-none cursor-pointer hover:bg-white/10 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold uppercase overflow-hidden text-sm shrink-0">
                    {authProfile.name ? authProfile.name.charAt(0) : <User size={16} />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white leading-none mb-1">{authProfile.name || "My Account"}</span>
                    <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest leading-none">{authRole}</span>
                  </div>
                </div>

                {/* Profile Details Dropdown */}
                {profileDropdown && (
                  <div className="absolute top-[60px] right-0 w-72 bg-[#242424] border border-white/10 rounded-2xl shadow-2xl p-5 z-50">
                     <div className="flex flex-col items-center border-b border-white/10 pb-4 mb-4 mt-2">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 text-white flex items-center justify-center font-black text-2xl uppercase shadow-lg shadow-blue-500/30 mb-3">
                          {authProfile.name ? authProfile.name.charAt(0) : <User size={30} />}
                        </div>
                        <h3 className="text-xl font-bold text-white text-center">{authProfile.name}</h3>
                        <p className="text-blue-400 font-bold uppercase text-xs tracking-widest mt-1">{authRole}</p>
                     </div>
                     <div className="space-y-4">
                       <div>
                         <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">Email Address</p>
                         <p className="text-sm text-slate-300 bg-[#1a1a1a] p-3 rounded-xl border border-white/5 break-all">{authProfile.email || authProfile.userEmail || authProfile.organizerEmail || "Not provided"}</p>
                       </div>
                       
                       {authRole === 'user' && (
                         <Link 
                           to="/history" 
                           onClick={() => setProfileDropdown(false)}
                           className="flex justify-between items-center bg-blue-600 hover:bg-blue-500 text-white font-bold p-3 rounded-xl transition w-full"
                         >
                           My History <History size={18} />
                         </Link>
                       )}
                     </div>
                  </div>
                )}
              </div>
            )}
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
          <div className="px-4 pt-4 space-y-1">
            <Link to="/home" className="flex items-center gap-4 px-3 py-3 text-white text-sm font-bold uppercase tracking-widest hover:bg-white/5 rounded-lg" onClick={() => setIsOpen(false)}><Home size={18} /> Home</Link>
            <Link to="/shop" className={`flex items-center gap-4 px-3 py-3 text-white text-sm font-bold uppercase tracking-widest hover:bg-white/5 rounded-lg ${isActive('/shop')}`} onClick={() => setIsOpen(false)}><ShoppingBag size={18} /> Shop</Link>
            <Link to="/booking" className={`flex items-center gap-4 px-3 py-3 text-white text-sm font-bold uppercase tracking-widest hover:bg-white/5 rounded-lg ${isActive('/booking')}`} onClick={() => setIsOpen(false)}><Book size={18} /> Book Tickets</Link>
            <Link to="/category" className={`flex items-center gap-4 px-3 py-3 text-white text-sm font-bold uppercase tracking-widest hover:bg-white/5 rounded-lg ${isActive('/category')}`} onClick={() => setIsOpen(false)}><ShoppingCart size={18} /> Cart</Link>
            <Link to="/contact" className={`flex items-center gap-4 px-3 py-3 text-white text-sm font-bold uppercase tracking-widest hover:bg-white/5 rounded-lg ${isActive('/contact')}`} onClick={() => setIsOpen(false)}><Mail size={18} /> Contact</Link>
            
            {/* Mobile Profile Display */}
            {authProfile && (
              <div className="flex flex-col gap-4 px-4 py-5 mb-2 mt-4 bg-white/5 rounded-xl border border-white/5">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold uppercase text-xl shrink-0">
                    {authProfile.name ? authProfile.name.charAt(0) : <User size={24} />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-white">{authProfile.name || "My Account"}</span>
                    <span className="text-xs text-blue-400 font-bold uppercase tracking-widest">{authRole} Area</span>
                  </div>
                 </div>
                 <div className="pt-3 border-t border-white/10">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Email Address</p>
                    <p className="text-sm text-slate-300 break-all">{authProfile.email || authProfile.userEmail || authProfile.organizerEmail || "Not provided"}</p>
                 </div>
              </div>
            )}
            
            <div className="pt-4 px-3">
              <button 
                onClick={handleLogout}
                className="w-full bg-red-600/10 text-red-500 border border-red-500/20 py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm uppercase tracking-widest"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;