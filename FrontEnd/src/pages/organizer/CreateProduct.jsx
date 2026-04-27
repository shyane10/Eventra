import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  PackagePlus, Edit3, Trash2, ArrowLeft, Upload, Loader2, Tag, DollarSign, User 
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

  // 1. Initial Load: Extract User and Fetch Products
  useEffect(() => {
    const storedData = localStorage.getItem("Organizer") || localStorage.getItem("user");
    if (storedData) {
      const parsedUser = JSON.parse(storedData);
      setUser(parsedUser);
      
      // CRITICAL: Check for both _id (MongoDB) and id (Your Controller)
      const userId = parsedUser._id || parsedUser.id;
      
      if (userId && userId !== "undefined") {
        fetchProducts(userId);
      }
    }
  }, []);

  const fetchProducts = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products/organizer/${userId}`);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentProduct({ ...currentProduct, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // 2. Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Re-verify the user session right at the moment of submission
    const storedData = localStorage.getItem("Organizer") || localStorage.getItem("user");
    const parsedUser = storedData ? JSON.parse(storedData) : null;
    
    // Safety check for both ID naming conventions
    const userId = user?._id || user?.id || parsedUser?._id || parsedUser?.id;

    if (!userId || userId === "undefined") {
      return alert("Authentication Error: Please log out and log back in to refresh your session.");
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", currentProduct.name);
    formData.append("artist", currentProduct.artist);
    formData.append("price", currentProduct.price);
    formData.append("category", currentProduct.category);
    formData.append("organizerId", userId); // This must be a valid string ID

    if (currentProduct.image && typeof currentProduct.image !== 'string') {
      formData.append("image", currentProduct.image);
    }

    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/products/update/${currentProduct.id}`, formData);
      } else {
        await axios.post("http://localhost:5000/api/products/add", formData);
      }
      
      alert(isEditing ? "Product updated!" : "Product published!");
      resetForm();
      fetchProducts(userId);
    } catch (err) {
      console.error("Submission Error:", err.response?.data);
      alert(err.response?.data?.message || "Failed to save product. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentProduct({ id: null, name: '', artist: '', price: '', category: 'Clothing', image: '' });
    setImagePreview(null);
    setIsEditing(false);
  };

  if (!user) return (
    <div className="min-h-screen bg-[#0a0f1d] flex items-center justify-center text-white">
      <div className="text-center">
        <Loader2 className="animate-spin mx-auto mb-4" size={40} />
        <p>Loading session...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-white font-sans p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={18} /> Back
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* LEFT: FORM */}
          <section className="bg-[#161e2f] p-8 rounded-[2rem] border border-white/5 shadow-xl h-fit">
            <h1 className="text-3xl font-black mb-8 italic uppercase tracking-tighter">
              {isEditing ? "Edit Product" : "New Merchandise"}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload Area */}
              <div className="relative h-48 bg-black/40 rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden group">
                {imagePreview ? (
                  <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <div className="text-slate-500 flex flex-col items-center">
                    <Upload size={32} />
                    <span className="text-xs mt-2 uppercase font-bold tracking-widest">Select Image</span>
                  </div>
                )}
                <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>

              <div className="space-y-4">
                <input 
                  type="text" placeholder="Product Name" 
                  value={currentProduct.name}
                  onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})}
                  className="w-full bg-black/20 border border-white/10 rounded-xl p-4 outline-none focus:border-blue-500" 
                  required 
                />
                <input 
                  type="text" placeholder="Artist Name" 
                  value={currentProduct.artist}
                  onChange={(e) => setCurrentProduct({...currentProduct, artist: e.target.value})}
                  className="w-full bg-black/20 border border-white/10 rounded-xl p-4 outline-none focus:border-blue-500" 
                  required 
                />
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="number" placeholder="Price" 
                    value={currentProduct.price}
                    onChange={(e) => setCurrentProduct({...currentProduct, price: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-4 outline-none focus:border-blue-500" 
                    required 
                  />
                  <select 
                    value={currentProduct.category}
                    onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-4 outline-none text-slate-400"
                  >
                    <option value="Clothing">Clothing</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Posters">Posters</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-black uppercase italic tracking-widest transition-all shadow-lg shadow-blue-900/20"
              >
                {loading ? <Loader2 className="animate-spin mx-auto" /> : isEditing ? "Update Product" : "Publish Product"}
              </button>
            </form>
          </section>

          {/* RIGHT: LIST */}
          <section>
            <h2 className="text-xl font-bold mb-6 text-slate-400 uppercase tracking-widest">Active Listings</h2>
            <div className="space-y-4">
              {products.map((p) => (
                <div key={p._id} className="bg-[#161e2f]/50 border border-white/5 p-4 rounded-2xl flex items-center gap-4 group hover:border-blue-500/50 transition-all">
                  <img src={p.image} className="w-20 h-20 object-cover rounded-xl" alt="" />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{p.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-slate-500 text-sm font-medium">Rs. {p.price}</p>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${p.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : p.status === 'Rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'}`}>
                        {p.status || 'Pending'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setIsEditing(true);
                        setCurrentProduct({ id: p._id, name: p.name, artist: p.artist, price: p.price, category: p.category, image: p.image });
                        setImagePreview(p.image);
                      }}
                      className="p-2 bg-white/5 hover:bg-blue-600 rounded-lg transition-colors"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={async () => {
                        if(window.confirm("Delete this?")) {
                          await axios.delete(`http://localhost:5000/api/products/delete/${p._id}`);
                          fetchProducts(user._id || user.id);
                        }
                      }}
                      className="p-2 bg-white/5 hover:bg-red-600 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;