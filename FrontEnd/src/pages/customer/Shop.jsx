import React, { useState } from 'react';
import { Search, Star, Tag, Zap } from 'lucide-react';

const Shop = () => {
  const [category, setCategory] = useState('All');

  const products = [
    {
      id: 1,
      name: "Arctic Monkeys 'AM' T-Shirt",
      artist: "Arctic Monkeys",
      price: 1200,
      category: "Clothing",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000",
      rating: 4.8
    },
    {
      id: 2,
      name: "The Weeknd 'After Hours' Cap",
      artist: "The Weeknd",
      price: 850,
      category: "Accessories",
      image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1000",
      rating: 4.5
    },
    {
      id: 3,
      name: "Travis Scott 'Utopia' Hoodie",
      artist: "Travis Scott",
      price: 2500,
      category: "Clothing",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000",
      rating: 4.9
    },
    {
      id: 4,
      name: "Coldplay 'Music of the Spheres' Tote",
      artist: "Coldplay",
      price: 600,
      category: "Accessories",
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000",
      rating: 4.7
    },
    {
      id: 5,
      name: "Sajjan Raj Vaidya Limited Tee",
      artist: "Sajjan Raj Vaidya",
      price: 1500,
      category: "Clothing",
      image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000",
      rating: 5.0
    },
    {
      id: 6,
      name: "1975 Vintage Band Poster",
      artist: "The 1975",
      price: 450,
      category: "Posters",
      image: "https://images.unsplash.com/photo-1583248818226-5db749961c9b?q=80&w=1000",
      rating: 4.6
    }
  ];

  const handleBuyNow = (product) => {
    // You can replace this with a redirect to a checkout page or Khalti/ESewa integration
    alert(`Redirecting to payment for: ${product.name} (Rs. ${product.price})`);
  };

  const filteredProducts = category === 'All' 
    ? products 
    : products.filter(p => p.category === category);

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
                className={`px-6 py-2 rounded-xl font-bold transition-all border whitespace-nowrap ${
                  category === cat 
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
              className="w-full pl-12 pr-4 py-3 bg-[#1e293b] border border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group bg-[#161e2f] rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-blue-500/30 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col">
              
              {/* Image Container */}
              <div className="relative h-80 overflow-hidden m-3 rounded-[2rem]">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 text-sm font-bold text-white border border-white/10">
                  <Star size={14} className="text-blue-400 fill-blue-400" />
                  {product.rating}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-8 pt-4 flex-1 flex flex-col">
                <p className="text-blue-400 font-black text-[10px] tracking-[0.2em] uppercase mb-2">{product.artist}</p>
                <h3 className="text-xl font-bold text-slate-100 mb-6 h-14 line-clamp-2 leading-tight">
                  {product.name}
                </h3>
                
                <div className="mt-auto flex flex-col gap-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-slate-500 text-[10px] font-bold tracking-widest">PRICE</p>
                      <p className="text-3xl font-black text-white">Rs. {product.price}</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleBuyNow(product)}
                    className="w-full bg-white text-[#0a0f1d] py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-blue-400 transition-all active:scale-[0.98] shadow-lg"
                  >
                    <Zap size={18} className="fill-current" />
                    BUY NOW
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
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
    </div>
  );
};

export default Shop;