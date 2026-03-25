import React, { useState } from "react";
import { Menu, X, User, Book, Home, Info, Mail } from "lucide-react"; // Added icons
import { Link, useLocation } from "react-router-dom";
import logo from "../image/image.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const hideNavbarPaths = ["/", "/register"];
  if (hideNavbarPaths.includes(location.pathname)) return null;

  const isActive = (path) => location.pathname === path ? "text-blue-500" : "text-white";

  return (
    <nav className="bg-slate-950 text-white shadow-md sticky top-0 z-50 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Left Side: Home & Events */}
          <div className="hidden md:flex items-center space-x-6 flex-1">
            <Link to="/home" className={`flex items-center gap-1.5 hover:text-blue-500 font-medium transition ${isActive('/home')}`}>
              <Home size={18} /> Home
            </Link>
            <Link to="/events" className={`flex items-center gap-1.5 hover:text-blue-500 font-medium transition ${isActive('/events')}`}>
              Events <Book size={18} /> {/* Book icon on the right */}
            </Link>
          </div>

          {/* Center: Logo */}
          <div className="flex-shrink-0 flex justify-center">
            <Link to="/home">
              <img
                className="h-16 w-auto object-contain mix-blend-screen"
                src={logo}
                alt="Eventra Logo"
              />
            </Link>
          </div>

          {/* Right Side: About, Contact & CTA */}
          <div className="hidden md:flex items-center justify-end space-x-5 flex-1">
            <Link to="/about" className={`flex items-center gap-1.5 hover:text-blue-500 font-medium transition ${isActive('/about')}`}>
              <Info size={18} /> About Us
            </Link>
            <Link to="/contact" className={`flex items-center gap-1.5 hover:text-blue-500 font-medium transition ${isActive('/contact')}`}>
              <Mail size={18} /> Contact Us
            </Link>

            <Link
              to="/register"
              className="bg-blue-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-blue-700 transition flex items-center gap-2"
            >
              <User size={18} /> Sign Up
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-blue-500">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-950 border-t border-slate-800">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link to="/home" className="flex items-center gap-2 px-3 py-2 text-white hover:bg-slate-800 rounded-md"><Home size={18} /> Home</Link>
            <Link to="/events" className="flex items-center gap-2 px-3 py-2 text-white hover:bg-slate-800 rounded-md">Events <Book size={18} /></Link>
            <Link to="/about" className="flex items-center gap-2 px-3 py-2 text-white hover:bg-slate-800 rounded-md"><Info size={18} /> About Us</Link>
            <Link to="/contact" className="flex items-center gap-2 px-3 py-2 text-white hover:bg-slate-800 rounded-md"><Mail size={18} /> Contact Us</Link>
            <div className="pt-4">
              <Link to="/profile" className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-bold flex items-center justify-center gap-2">
                <User size={18} /> Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;