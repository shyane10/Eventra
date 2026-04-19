import React, { useState, useEffect } from 'react';
import { Search, Star, Tag, ShoppingCart, X, Plus, Minus, Trash2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Shop = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState('All');
  const [products, setProducts] = useState([]); // State for DB products
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Initialize cart from localStorage
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('eventra_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // 1. DYNAMIC FETCH: Get all products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // This hits the getProducts controller in your backend
        const res = await axios.get('http://localhost:5000/api/products'); 
        console.log("Shop Products Data:", res.data);
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching shop products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Persist cart to localStorage on change
  useEffect(() => {
    localStorage.setItem('eventra_cart', JSON.stringify(cart));
  }, [cart]);

  // Auto-hide toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      // Use _id because MongoDB uses _id instead of id
      const existingItem = prevCart.find((item) => item._id === product._id);
      if (existingItem) {
        return prevCart.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setToastMessage(`${product.name} added to cart!`);
  };

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

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsCartOpen(false);
    navigate('/category');
  };

  // Improved filtering to include search and category
  const filteredProducts = products.filter(p => {
    const matchesCategory = category === 'All' || p.category === category;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.artist.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-white font-sans">

      {/* Hero Header Section */}
      <div className="relative bg-[#0f172a] py-16 px-6 overflow-hidden border-b border-white/5">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <span className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-blue-500/20">
            <Tag size={14} /> Official Merchandise
          </span>
          <h2 className="text-4xl md:text-6xl font-black mb-6 italic tracking-tighter">
            WEAR THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">VIBE.</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-lg font-medium">
            One-click checkout for exclusive artist drops. No carts, no waiting.
          </p>
        </div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12">

        {/* Search and Filters Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="flex gap-3 overflow-x-auto w-full md:w-auto pb-2">
            {['All', 'Clothing', 'Accessories', 'Posters'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-6 py-2 rounded-xl font-bold transition-all border whitespace-nowrap ${category === cat
                    ? "bg-blue-600 border-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                    : "bg-[#1e293b] border-white/5 text-slate-400 hover:border-blue-500/50"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Quick search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#1e293b] border border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Loading State or Product Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-500 mb-4" size={48} />
            <p className="text-slate-500 animate-pulse">Fetching latest drops...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProducts.map((product) => (
              <div key={product._id} className="group bg-[#161e2f] rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-blue-500/30 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col">

                {/* Image Container */}
                <div className="relative h-80 overflow-hidden m-3 rounded-[2rem]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 text-sm font-bold text-white border border-white/10">
                    <Star size={14} className="text-blue-400 fill-blue-400" />
                    {product.rating || "5.0"}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-8 pt-4 flex-1 flex flex-col">
                  <p className="text-blue-400 font-black text-[10px] tracking-[0.2em] uppercase mb-2">{product.artist}</p>
                  <h3 className="text-xl font-bold text-slate-100 mb-6 h-14 line-clamp-2 leading-tight uppercase italic">
                    {product.name}
                  </h3>

                  <div className="mt-auto flex flex-col gap-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-slate-500 text-[10px] font-bold tracking-widest uppercase">PRICE</p>
                        <p className="text-3xl font-black text-white">Rs. {product.price}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-blue-500 transition-all active:scale-[0.98] shadow-lg shadow-blue-500/25"
                    >
                      <ShoppingCart size={18} />
                      ADD TO CART
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Newsletter Section */}
      <section className="max-w-7xl mx-auto px-6 mb-24 text-center">
        <div className="bg-[#1e293b] rounded-[3rem] p-12 border border-white/5 relative overflow-hidden">
          <h2 className="text-3xl font-black mb-4">NEVER MISS A DROP.</h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">Enter your email to get early access to limited edition artist merchandise.</p>
          <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-3 relative z-10">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-[#0a0f1d] border border-white/5 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 px-8 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all">
              Join List
            </button>
          </div>
        </div>
      </section>

      {/* Floating Cart Button */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:bg-blue-500 hover:scale-105 transition-all z-40 group"
      >
        <ShoppingCart size={28} />
        {getCartCount() > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            {getCartCount()}
          </span>
        )}
      </button>

      {/* Cart Drawer Overlay */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
          onClick={() => setIsCartOpen(false)}
        ></div>
      )}

      {/* Cart Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#161e2f] border-l border-white/10 z-50 transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <ShoppingCart className="text-blue-500" size={24} />
            <h2 className="text-2xl font-black">Your Cart</h2>
            <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-bold ml-2">
              {getCartCount()} Items
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
              <ShoppingCart size={64} className="opacity-20" />
              <p className="font-medium text-lg text-slate-400">Your cart is empty.</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-4 text-blue-400 hover:text-blue-300 font-bold underline underline-offset-4"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item._id} className="flex gap-4 bg-[#1e293b] p-4 rounded-3xl border border-white/5 relative group">
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-2xl" />
                <div className="flex-1 flex flex-col">
                  <p className="text-blue-400 text-xs font-bold uppercase tracking-wider">{item.artist}</p>
                  <h4 className="font-bold text-white line-clamp-1 uppercase">{item.name}</h4>
                  <p className="text-slate-400 font-bold text-lg mt-1">Rs. {item.price}</p>

                  <div className="flex items-center gap-4 mt-auto pt-2">
                    <div className="flex items-center gap-3 bg-[#0a0f1d] px-3 py-1.5 rounded-xl border border-white/5">
                      <button
                        onClick={() => updateQuantity(item._id, -1)}
                        className="text-slate-400 hover:text-white transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, 1)}
                        className="text-slate-400 hover:text-white transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="absolute top-4 right-4 text-slate-500 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-white/5 opacity-0 group-hover:opacity-100 duration-200"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-white/5 bg-[#1e293b]/50 backdrop-blur-md">
            <div className="flex justify-between items-center mb-6">
              <span className="text-slate-400 font-bold uppercase tracking-wider">Subtotal</span>
              <span className="text-3xl font-black text-white">Rs. {getCartTotal()}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-blue-500/25 text-lg"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-4 fade-in duration-300">
          <ShoppingCart size={18} />
          {toastMessage}
        </div>
      )}

    </div>
  );
};

export default Shop;