import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0f1d] text-slate-300 border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand & Bio */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white italic tracking-tighter">
              EVENT<span className="text-blue-500">RA</span>
            </h2>
            <p className="text-sm leading-relaxed text-slate-400">
              Nepal's premier platform for discovering extraordinary experiences. From underground gigs to massive festivals, we bring the stage to your screen.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-[#161e2f] rounded-lg hover:text-blue-400 transition-colors border border-white/5">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 bg-[#161e2f] rounded-lg hover:text-blue-400 transition-colors border border-white/5">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 bg-[#161e2f] rounded-lg hover:text-blue-400 transition-colors border border-white/5">
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Navigation</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/home" className="hover:text-blue-400 transition-colors">Home</Link></li>
              <li><Link to="/events/upcoming" className="hover:text-blue-400 transition-colors">Upcoming Events</Link></li>
              <li><Link to="/shop" className="hover:text-blue-400 transition-colors">Merch Store</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Support</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-blue-500 shrink-0" />
                <span>Kathmandu, Nepal<br />Durbar Marg, 44600</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-blue-500 shrink-0" />
                <span>+977 1-4200000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-blue-500 shrink-0" />
                <span>support@eventra.com.np</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Stay Updated</h3>
            <p className="text-sm text-slate-400 mb-4">Subscribe for early-bird ticket alerts.</p>
            <form className="relative">
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full bg-[#161e2f] border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 p-2 rounded-lg text-white hover:bg-blue-500 transition-all">
                <Send size={16} />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold tracking-widest uppercase text-slate-500">
          <p>© {currentYear} Eventra Tech. All Rights Reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;