import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  PackagePlus, Edit3, Trash2, X, ArrowLeft, Upload, Loader2, Star, Tag, DollarSign, User 
} from 'lucide-react';

const CreateProduct = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);

  const [currentProduct, setCurrentProduct] = useState({
    id: null, name: '', artist: '', price: '', category: 'Clothing', image: ''
  });

  // 1. Initial Load (Safe check for user)
  useEffect(() => {
    const storedData = localStorage.getItem("Organizer") || localStorage.getItem("user");
    if (storedData) {
      const parsedUser = JSON.parse(storedData);
      setUser(parsedUser);
      fetchProducts(parsedUser._id);
    }
  }, []);

  const fetchProducts = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5000/organizer/${userId}`);
      setProducts(res.data);
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentProduct({ ...currentProduct, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please log in again.");
    
    setLoading(true);
    const formData = new FormData();
    formData.append("name", currentProduct.name);
    formData.append("artist", currentProduct.artist);
    formData.append("price", currentProduct.price);
    formData.append("category", currentProduct.category);
    formData.append("organizerId", user._id);
    if (currentProduct.image) formData.append("image", currentProduct.image);

    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/update/${currentProduct.id}`, formData);
      } else {
        await axios.post("http://localhost:5000/add", formData);
      }
      resetForm();
      fetchProducts(user._id);
      alert("Success!");
    } catch (err) {
      alert("Server Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentProduct({ id: null, name: '', artist: '', price: '', category: 'Clothing', image: '' });
    setImagePreview(null);
    setIsEditing(false);
  };

  if (!user) return <div className="min-h-screen bg-[#0a0f1d] flex items-center justify-center text-white">Loading session...</div>;

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-white font-sans selection:bg-blue-500/30">
      {/* Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Navigation */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-500 hover:text-white transition-all mb-10 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
          <span className="font-medium tracking-wide">Back to Dashboard</span>
        </button>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-blue-600/20 rounded-2xl border border-blue-500/30">
              <PackagePlus className="text-blue-400" size={28} />
            </div>
            <h1 className="text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">
              {isEditing ? "EDIT PRODUCT" : "CREATE MERCHANDISE"}
            </h1>
          </div>
          <p className="text-slate-400 max-w-xl">List your exclusive band merchandise, posters, and accessories for the fans.</p>
        </header>

        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* FORM SECTION */}
          <section className="lg:col-span-5">
            <div className="bg-[#161e2f]/60 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl sticky top-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Image Upload Area */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Cover Image</label>
                  <div className={`relative h-64 rounded-3xl border-2 border-dashed transition-all group overflow-hidden ${imagePreview ? 'border-blue-500/50' : 'border-white/10 hover:border-blue-500/30'}`}>
                    {imagePreview ? (
                      <img src={imagePreview} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Preview" />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-500">
                        <Upload size={40} className="group-hover:text-blue-400 transition-colors" />
                        <span className="text-xs font-bold uppercase tracking-widest">Upload Product View</span>
                      </div>
                    )}
                    <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" accept="image/*" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d] via-transparent to-transparent opacity-60"></div>
                  </div>
                </div>

                {/* Input Fields */}
                <div className="grid grid-cols-1 gap-5">
                  <div className="relative group">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                    <input type="text" placeholder="Product Name" value={currentProduct.name} onChange={(e)=>setCurrentProduct({...currentProduct, name: e.target.value})} className="w-full bg-[#0a0f1d]/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600" required />
                  </div>

                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400" size={18} />
                    <input type="text" placeholder="Artist / Performer" value={currentProduct.artist} onChange={(e)=>setCurrentProduct({...currentProduct, artist: e.target.value})} className="w-full bg-[#0a0f1d]/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/50" required />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative group">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400" size={18} />
                      <input type="number" placeholder="Price" value={currentProduct.price} onChange={(e)=>setCurrentProduct({...currentProduct, price: e.target.value})} className="w-full bg-[#0a0f1d]/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/50" required />
                    </div>
                    <select value={currentProduct.category} onChange={(e)=>setCurrentProduct({...currentProduct, category: e.target.value})} className="bg-[#0a0f1d]/50 border border-white/5 rounded-2xl py-4 px-4 outline-none text-slate-400 focus:border-blue-500/50">
                      <option>Clothing</option>
                      <option>Posters</option>
                      <option>Accessories</option>
                    </select>
                  </div>
                </div>

                <button 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 py-4 rounded-2xl font-black italic tracking-widest uppercase shadow-xl shadow-blue-900/20 hover:shadow-blue-500/40 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin mx-auto" /> : isEditing ? "UPDATE ITEM" : "PUBLISH TO SHOP"}
                </button>
              </form>
            </div>
          </section>

          {/* LIST SECTION */}
          <section className="lg:col-span-7">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
              LIVE IN STORE <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-mono text-blue-400">{products.length}</span>
            </h2>
            
            <div className="grid gap-6">
              {products.map((p) => (
                <div key={p._id} className="group bg-[#161e2f]/40 backdrop-blur-md border border-white/5 p-4 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-6 hover:border-blue-500/30 transition-all">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-[1.5rem] overflow-hidden">
                    <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">{p.artist}</span>
                    <h3 className="text-2xl font-black italic tracking-tighter mt-1">{p.name}</h3>
                    <div className="flex items-center justify-center md:justify-start gap-4 mt-2">
                      <p className="text-xl font-mono font-bold text-white">Rs.{p.price}</p>
                      <span className="text-[10px] px-2 py-1 bg-white/5 rounded border border-white/10 text-slate-500">{p.category}</span>
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-3">
                    <button 
                      onClick={() => {
                        setIsEditing(true);
                        setCurrentProduct({ id: p._id, name: p.name, artist: p.artist, price: p.price, category: p.category, image: '' });
                        setImagePreview(p.image);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="p-4 bg-white/5 hover:bg-blue-600 rounded-2xl transition-all"
                    >
                      <Edit3 size={20} />
                    </button>
                    <button 
                      onClick={async () => {
                        if(window.confirm("Remove item from store?")) {
                          await axios.delete(`http://localhost:5000/delete/${p._id}`);
                          fetchProducts(user._id);
                        }
                      }}
                      className="p-4 bg-white/5 hover:bg-red-600 rounded-2xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}

              {products.length === 0 && (
                <div className="py-24 text-center bg-[#161e2f]/20 rounded-[3rem] border-2 border-dashed border-white/5">
                  <p className="text-slate-500 font-medium italic">No merchandise listed yet.</p>
                </div>
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default CreateProduct;