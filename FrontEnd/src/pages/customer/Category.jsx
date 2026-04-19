import React, { useState, useEffect } from "react";
import { ShoppingBag, ArrowLeft, Trash2, Plus, Minus, CreditCard, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Category = () => {
  // Initialize cart from localStorage securely
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('eventra_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const navigate = useNavigate();

  // Sync cart back to localStorage whenever it changes here
  useEffect(() => {
    localStorage.setItem('eventra_cart', JSON.stringify(cart));
  }, [cart]);

  const updateQuantity = (id, amount) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item._id === id) {
          const newQuantity = item.quantity + amount;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      })
    );
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== id));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to checkout.");
        navigate("/");
        return;
      }

      const totalAmount = getCartTotal();

      const response = await axios.post("http://localhost:5000/api/payment/initialize", {
        amount: totalAmount,
        purchaseType: "product",
        cartItems: cart,
        purchase_order_name: "Eventra Merch Order",
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success && response.data.payment_url) {
        window.location.href = response.data.payment_url;
      } else {
        alert("Failed to initialize payment.");
      }
    } catch (err) {
      console.error("Checkout Error:", err.response?.data || err.message);
      alert("Failed to process checkout. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-white font-sans p-6 md:p-12">
      <div className="max-w-6xl mx-auto flex flex-col h-full">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 mb-2">
              Your Cart
            </h1>
            <p className="text-slate-400 text-lg">Review and manage your selected items.</p>
          </div>
          <button 
            onClick={() => navigate('/shop')}
            className="flex items-center gap-2 bg-[#1e293b] hover:bg-slate-800 border border-white/5 px-5 py-3 rounded-xl transition text-slate-300 font-bold"
          >
            <ArrowLeft size={18} /> Continue Shopping
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-col flex-1 items-center justify-center py-32 bg-[#161e2f] rounded-[3rem] border border-white/5">
            <ShoppingBag size={80} className="text-slate-600 mb-6" />
            <h2 className="text-3xl font-black text-white mb-2">It's quiet in here...</h2>
            <p className="text-slate-400 text-lg mb-8 max-w-sm text-center">Your cart is empty. Why not explore our latest merchandise and add something cool?</p>
            <Link 
              to="/shop" 
              className="bg-blue-600 hover:bg-blue-500 text-white font-black px-8 py-4 rounded-xl shadow-lg shadow-blue-600/20 transition hover:scale-105"
            >
              Go to Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item) => (
                <div key={item._id} className="flex flex-col sm:flex-row gap-6 bg-[#161e2f] p-6 rounded-[2rem] border border-white/5 relative group hover:border-blue-500/30 transition-colors">
                  
                  {/* Image */}
                  <div className="w-full sm:w-40 h-40 flex-shrink-0 rounded-[1.5rem] overflow-hidden bg-[#0a0f1d]">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  
                  {/* Info */}
                  <div className="flex flex-col flex-1 py-1">
                    <p className="text-blue-400 font-black text-xs tracking-[0.2em] uppercase mb-1">{item.artist}</p>
                    <h3 className="text-2xl font-bold text-white mb-2 line-clamp-2">{item.name}</h3>
                    <p className="text-slate-400 font-medium mb-auto text-sm">{item.category}</p>
                    
                    <div className="flex items-end justify-between mt-6">
                      <div className="flex items-center gap-4 bg-[#0a0f1d] px-4 py-2.5 rounded-xl border border-white/5">
                        <button onClick={() => updateQuantity(item._id, -1)} className="text-slate-400 hover:text-white transition">
                          <Minus size={16} />
                        </button>
                        <span className="font-black text-lg w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, 1)} className="text-slate-400 hover:text-white transition">
                          <Plus size={16} />
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Price</p>
                        <p className="text-2xl font-black text-white">Rs. {item.price * item.quantity}</p>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button 
                    onClick={() => removeFromCart(item._id)}
                    className="absolute top-6 right-6 text-slate-500 hover:bg-red-500/10 hover:text-red-500 p-2 rounded-full transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary Checkout Panel */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-[#161e2f] to-[#0a0f1d] p-8 rounded-[2rem] border border-white/5 sticky top-36 shadow-2xl">
                <h3 className="text-2xl font-black text-white mb-6 pb-6 border-b border-white/5">Order Summary</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-slate-400 font-medium">
                    <span>Subtotal ({getCartCount()} items)</span>
                    <span>Rs. {getCartTotal()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 font-medium">
                    <span>Shipping</span>
                    <span className="text-emerald-400 font-bold">FREE</span>
                  </div>
                </div>

                <div className="flex justify-between items-end mb-8 pt-6 border-t border-white/5">
                  <span className="text-slate-400 uppercase tracking-widest text-sm font-bold">Total</span>
                  <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                    Rs. {getCartTotal()}
                  </span>
                </div>

                <button 
                  onClick={handleCheckout}
                  className="w-full bg-white hover:bg-blue-50 text-[#0a0f1d] font-black py-4 rounded-xl flex justify-center items-center gap-2 mb-4 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                >
                  <CreditCard className="text-[#0a0f1d]" size={20} />
                  SECURE CHECKOUT
                </button>

                <div className="flex items-center justify-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest mt-6">
                  <ShieldCheck size={16} /> 100% Safe & Secure
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Category;
