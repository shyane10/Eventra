import React, { useState } from "react";
import { CreditCard, Wallet, Users, Ticket, CheckCircle2, ShieldCheck, ArrowLeft, Calendar, MapPin } from "lucide-react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Book = () => {
  const [ticketCount, setTicketCount] = useState(1);
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const location = useLocation();
  const navigate = useNavigate();
  
  const event = location.state?.event;
  const TICKET_PRICE = event?.ticketPrice ? Number(event.ticketPrice) : 0;
  const SERVICE_FEE = event ? 50 : 0; // only charge fee if there is an event

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to book tickets.");
        navigate("/");
        return;
      }

      const totalAmount = (TICKET_PRICE * ticketCount) + SERVICE_FEE;

      const response = await axios.post("http://localhost:5000/api/payment/initialize", {
        amount: totalAmount,
        eventId: event._id,
        quantity: ticketCount,
        purchase_order_name: `Ticket for ${event.title}`,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success && response.data.payment_url) {
        // Redirect to Khalti
        window.location.href = response.data.payment_url;
      } else {
        alert("Failed to initialize payment with Khalti.");
      }
    } catch (err) {
      console.error("Payment Error:", err.response?.data || err.message);
      alert("Failed to process payment. Please try again later.");
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-4">
        <Ticket size={64} className="text-slate-600 mb-6" />
        <h1 className="text-3xl font-black mb-2">No Event Selected</h1>
        <p className="text-slate-400 mb-8 text-center max-w-sm">Please select an event from the events page to proceed with booking tickets.</p>
        <Link to="/events/upcoming" className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3 rounded-xl transition">
          Browse Events
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans p-4 md:p-10 selection:bg-purple-500">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-10">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-slate-400 hover:text-white transition font-bold mb-6"
          >
            <ArrowLeft size={18} /> Back to Event
          </button>
          
          <div className="flex flex-col md:flex-row gap-6 items-center bg-slate-900/50 p-6 rounded-[2rem] border border-slate-800 backdrop-blur-sm">
            <img 
              src={event.eventImage || "https://via.placeholder.com/400x400?text=Event"} 
              alt={event.title}
              className="w-full md:w-32 md:h-32 object-cover rounded-2xl"
            />
            <div className="text-center md:text-left">
              <span className="bg-blue-500/20 text-blue-400 text-xs font-bold uppercase px-3 py-1 rounded-full mb-3 inline-block">
                {event.category || "Event"}
              </span>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 text-white">
                {event.title}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-400 text-sm font-medium">
                <span className="flex items-center gap-1.5"><Calendar size={16} className="text-blue-500"/> {new Date(event.startDate).toLocaleDateString()}</span>
                <span className="flex items-center gap-1.5"><MapPin size={16} className="text-red-500"/> {event.venueName}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Form Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Ticket Selection */}
            <section className="bg-slate-900/50 border border-slate-800 p-6 md:p-8 rounded-[2rem] backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <Ticket className="text-purple-500" />
                <h2 className="text-xl font-bold">Select Tickets</h2>
              </div>
              
              <div className="flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div>
                  <p className="font-bold">Standard Entrance</p>
                  <p className="text-sm text-slate-500 font-mono">{TICKET_PRICE > 0 ? `NPR ${TICKET_PRICE} / person` : "FREE"} </p>
                </div>
                <div className="flex items-center gap-4 bg-slate-900 p-2 rounded-xl">
                  <button 
                    onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                    className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 transition flex items-center justify-center font-bold"
                  >-</button>
                  <span className="text-lg font-bold min-w-[20px] text-center">{ticketCount}</span>
                  <button 
                    onClick={() => setTicketCount(ticketCount + 1)}
                    className="w-10 h-10 rounded-lg bg-purple-600 hover:bg-purple-500 transition flex items-center justify-center font-bold"
                  >+</button>
                </div>
              </div>
            </section>

            {/* 2. Attendee Details */}
            <section className="bg-slate-900/50 border border-slate-800 p-6 md:p-8 rounded-[2rem]">
              <div className="flex items-center gap-3 mb-6">
                <Users className="text-blue-500" />
                <h2 className="text-xl font-bold">Attendee Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-slate-500 font-bold ml-1">Full Name</label>
                  <input type="text" placeholder="Your Name" className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none transition" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-slate-500 font-bold ml-1">Phone Number</label>
                  <input type="text" placeholder="98XXXXXXXX" className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none transition" />
                </div>
              </div>
            </section>

            {/* 3. Payment Method */}
            <section className="bg-slate-900/50 border border-slate-800 p-6 md:p-8 rounded-[2rem]">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="text-emerald-500" />
                <h2 className="text-xl font-bold">Choose Payment Method</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Khalti Option */}
                <div className="relative group cursor-pointer">
                  <div className="flex items-center p-5 border-2 border-purple-600 bg-purple-600/10 rounded-2xl transition">
                    <div className="bg-[#5C2D91] p-2 rounded-lg mr-4">
                        <Wallet size={24} className="text-white" />
                    </div>
                    <div>
                        <p className="font-bold">Khalti Wallet</p>
                        <p className="text-xs text-purple-300">Fast & Secure</p>
                    </div>
                    <CheckCircle2 className="ml-auto text-purple-500" size={20} />
                  </div>
                </div>
                
                {/* Other (Disabled for focus) */}
                <div className="flex items-center p-5 border border-slate-800 bg-slate-900/50 rounded-2xl opacity-40 grayscale cursor-not-allowed">
                  <CreditCard size={24} className="mr-4 text-slate-400" />
                  <span className="font-medium text-slate-400">Card Payment</span>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Checkout Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-slate-900 to-[#020617] border border-slate-800 p-8 rounded-[2.5rem] sticky top-28 shadow-2xl">
              <div className="mb-6 pb-6 border-b border-slate-800">
                <h3 className="text-xl font-bold mb-4">Summary</h3>
                <div className="flex justify-between text-slate-400 mb-2">
                  <span>Standard Pass x {ticketCount}</span>
                  <span>NPR {TICKET_PRICE * ticketCount}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Service Charge</span>
                  <span>NPR {SERVICE_FEE}</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-8">
                <span className="text-slate-400 uppercase tracking-tighter text-sm font-bold">Total Amount</span>
                <span className="text-3xl font-black text-white">
                  NPR {(TICKET_PRICE * ticketCount) + SERVICE_FEE}
                </span>
              </div>

              <button 
                onClick={handlePayment}
                className="w-full bg-[#5C2D91] hover:bg-[#4a2475] text-white font-black py-5 rounded-2xl transition-all transform active:scale-95 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(92,45,145,0.4)]"
              >
                PAY WITH KHALTI
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-slate-500 text-xs uppercase font-bold tracking-widest">
                <ShieldCheck size={16} />
                Secure Checkout
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Book;