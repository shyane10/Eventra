import React, { useState } from "react";
import { CreditCard, Wallet, Users, Ticket, CheckCircle2, ShieldCheck } from "lucide-react";

const Book = () => {
  const [ticketCount, setTicketCount] = useState(1);
  const TICKET_PRICE = 1500; // NPR
  const SERVICE_FEE = 50;

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans p-4 md:p-10 selection:bg-purple-500">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Secure Your Tickets
          </h1>
          <p className="text-slate-400 max-w-2xl">
            You're just one step away from the biggest concert of 2026. Review your details and pay securely via Khalti.
          </p>
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
                  <p className="text-sm text-slate-500 font-mono">NPR {TICKET_PRICE} / person</p>
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

              <button className="w-full bg-[#5C2D91] hover:bg-[#4a2475] text-white font-black py-5 rounded-2xl transition-all transform active:scale-95 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(92,45,145,0.4)]">
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