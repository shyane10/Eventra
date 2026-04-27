// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { 
//   Calendar, MapPin, Ticket, Type, Image as ImageIcon, 
//   Loader2, PlusCircle, X, AlignLeft 
// } from "lucide-react";

// const CreateEvent = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [selectedFile, setSelectedFile] = useState(null);

//   const [formData, setFormData] = useState({
//     title: "",
//     description: "", // This must be filled!
//     category: "Music",
//     startDate: "",
//     endDate: "",
//     locationType: "Venue",
//     venueName: "",
//     address: "",
//     totalCapacity: "",
//     ticketPrice: 0,
//     isFree: false,
//   });

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//       // Logic: if isFree is checked, force price to 0
//       ticketPrice: name === "isFree" && checked ? 0 : (name === "ticketPrice" ? value : prev.ticketPrice)
//     }));
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setSelectedFile(file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (new Date(formData.startDate) >= new Date(formData.endDate)) {
//       alert("End Date must be after the Start Date!");
//       return;
//     }

//     setLoading(true);
//     const token = localStorage.getItem("token");

//     const data = new FormData();
//     Object.keys(formData).forEach((key) => {
//       data.append(key, formData[key]);
//     });

//     if (selectedFile) {
//       data.append("eventImage", selectedFile);
//     }

//     try {
//       await axios.post(
//         "http://localhost:5000/createEvent", // Updated prefix
//         data,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       alert("Event Published Successfully!");
//       navigate("/organizer-home");
//     } catch (error) {
//       console.error("Upload Error:", error);
//       alert(error.response?.data?.message || "Failed to create event. Check if description is missing.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-950 p-4 md:p-8 text-slate-200">
//       <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        
//         <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
//           <h2 className="text-3xl font-bold flex items-center gap-3">
//             <PlusCircle size={32} /> Launch Your Event
//           </h2>
//           <p className="text-blue-100 mt-2">Make sure to fill all fields, especially the description!</p>
//         </div>

//         <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
//           {/* Image Upload */}
//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold text-pink-400 flex items-center gap-2 border-b border-slate-800 pb-2">
//               <ImageIcon size={20} /> Event Banner
//             </h3>
//             <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-2xl p-6 hover:border-blue-500 transition-colors bg-slate-950/50">
//               {imagePreview ? (
//                 <div className="relative w-full h-64">
//                   <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
//                   <button type="button" onClick={() => {setImagePreview(null); setSelectedFile(null);}} className="absolute top-2 right-2 bg-red-500 p-2 rounded-full hover:bg-red-600"><X size={18} /></button>
//                 </div>
//               ) : (
//                 <label className="cursor-pointer flex flex-col items-center">
//                   <ImageIcon size={48} className="text-slate-500 mb-2" />
//                   <span className="text-slate-400">Click to upload event banner</span>
//                   <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
//                 </label>
//               )}
//             </div>
//           </div>

//           {/* Basic Info */}
//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold text-blue-400 flex items-center gap-2 border-b border-slate-800 pb-2">
//               <Type size={20} /> Basic Information
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium mb-2">Event Title</label>
//                 <input type="text" name="title" required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3" onChange={handleChange} />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2">Category</label>
//                 <select name="category" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3" onChange={handleChange}>
//                   <option value="Music">Music</option>
//                   <option value="Tech">Tech</option>
//                   <option value="Workshop">Workshop</option>
//                   <option value="Sports">Sports</option>
//                 </select>
//               </div>
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium mb-2">Description</label>
//                 <textarea name="description" required rows="3" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3" placeholder="What is this event about?" onChange={handleChange}></textarea>
//               </div>
//             </div>
//           </div>

//           {/* Date & Location */}
//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold text-purple-400 flex items-center gap-2 border-b border-slate-800 pb-2">
//               <MapPin size={20} /> Date & Venue
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-emerald-400">Start Date</label>
//                 <input type="datetime-local" name="startDate" required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3" onChange={handleChange} />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-rose-400">End Date</label>
//                 <input type="datetime-local" name="endDate" required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3" onChange={handleChange} />
//               </div>
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium mb-2">Venue Name & Address</label>
//                 <input type="text" name="venueName" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3" onChange={handleChange} />
//               </div>
//             </div>
//           </div>

//           {/* Tickets */}
//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold text-green-400 flex items-center gap-2 border-b border-slate-800 pb-2">
//               <Ticket size={20} /> Pricing & Seats
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div>
//                 <label className="block text-sm font-medium mb-2">Total Tickets</label>
//                 <input type="number" name="totalCapacity" required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3" onChange={handleChange} />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2">Price (Rs.)</label>
//                 <input type="number" name="ticketPrice" disabled={formData.isFree} value={formData.isFree ? 0 : formData.ticketPrice} className={`w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 ${formData.isFree ? 'opacity-30' : ''}`} onChange={handleChange} />
//               </div>
//               <div className="flex items-center mt-8 cursor-pointer">
//                 <input type="checkbox" name="isFree" id="isFree" className="w-5 h-5 accent-blue-600" onChange={handleChange} />
//                 <label htmlFor="isFree" className="ml-3 font-medium">Free Entry</label>
//               </div>
//             </div>
//           </div>

//           <div className="pt-6">
//             <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3">
//               {loading ? <Loader2 className="animate-spin" /> : <PlusCircle size={22} />}
//               {loading ? "Publishing..." : "Publish Event Now"}
//             </button>
//           </div>

//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateEvent;


import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Calendar, MapPin, Ticket, Type, Image as ImageIcon, 
  Loader2, PlusCircle, X, AlignLeft, Edit3
} from "lucide-react";

const CreateEvent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const eventToEdit = location.state?.event;

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(eventToEdit?.eventImage || null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Constants to fix the "202300" date overflow and past date issues
  const now = new Date().toISOString().slice(0, 16);
  const maxDate = "2099-12-31T23:59";

  const [formData, setFormData] = useState({
    title: eventToEdit?.title || "",
    description: eventToEdit?.description || "", 
    category: eventToEdit?.category || "Music",
    startDate: eventToEdit ? new Date(eventToEdit.startDate).toISOString().slice(0, 16) : "",
    endDate: eventToEdit ? new Date(eventToEdit.endDate).toISOString().slice(0, 16) : "",
    locationType: eventToEdit?.locationType || "Venue",
    venueName: eventToEdit?.venueName || "",
    address: eventToEdit?.address || "",
    totalCapacity: eventToEdit?.totalCapacity || "",
    ticketPrice: eventToEdit?.ticketPrice || "", // Fixed default 0
    isFree: eventToEdit?.isFree || false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Fix: Prevent users from entering years longer than 4 digits (e.g., 202300)
    if ((name === "startDate" || name === "endDate") && value.split("-")[0]?.length > 4) {
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ticketPrice: name === "isFree" && checked ? 0 : (name === "ticketPrice" ? value : prev.ticketPrice)
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic date logic validation
    if (!formData.startDate || !formData.endDate) {
      alert("Please select both Start and End dates.");
      return;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      alert("End Date must be after the Start Date!");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    if (selectedFile) {
      data.append("eventImage", selectedFile);
    }

    try {
      if (eventToEdit) {
        await axios.put(
          `http://localhost:5000/api/events/updateEvent/${eventToEdit._id}`, 
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert("Event Updated Successfully!");
      } else {
        await axios.post(
          "http://localhost:5000/api/events/createEvent", 
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert("Event Published Successfully!");
      }
      navigate("/organizer-home");
    } catch (error) {
      const backendMsg = error.response?.data?.message;
      const formattedMsg = Array.isArray(backendMsg) ? backendMsg.join(", ") : backendMsg;
      alert(formattedMsg || "Connection Error: Failed to reach the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 text-slate-200">
      <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
          <h2 className="text-3xl font-bold flex items-center gap-3">
            {eventToEdit ? <Edit3 size={32} /> : <PlusCircle size={32} /> }
            {eventToEdit ? "Edit Your Event" : "Launch Your Event"}
          </h2>
          <p className="text-blue-100 mt-2">Make sure to fill all fields, especially the description!</p>
        </div>

        {/* Added noValidate to stop the browser's native "Invalid Value" error bubble */}
        <form onSubmit={handleSubmit} noValidate className="p-8 space-y-8">
          
          {/* Image Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-pink-400 flex items-center gap-2 border-b border-slate-800 pb-2">
              <ImageIcon size={20} /> Event Banner
            </h3>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-2xl p-6 hover:border-blue-500 transition-colors bg-slate-950/50">
              {imagePreview ? (
                <div className="relative w-full h-64">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                  <button type="button" onClick={() => {setImagePreview(null); setSelectedFile(null);}} className="absolute top-2 right-2 bg-red-500 p-2 rounded-full hover:bg-red-600"><X size={18} /></button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center">
                  <ImageIcon size={48} className="text-slate-500 mb-2" />
                  <span className="text-slate-400">Click to upload event banner</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              )}
            </div>
          </div>

          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-400 flex items-center gap-2 border-b border-slate-800 pb-2">
              <Type size={20} /> Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Event Title</label>
                <input type="text" name="title" required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3" onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select name="category" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3" onChange={handleChange}>
                  <option value="Music">Music</option>
                  <option value="Tech">Tech</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Sports">Sports</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea name="description" required rows="3" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3" placeholder="What is this event about?" onChange={handleChange}></textarea>
              </div>
            </div>
          </div>

          {/* Date & Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-purple-400 flex items-center gap-2 border-b border-slate-800 pb-2">
              <MapPin size={20} /> Date & Venue
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-emerald-400">Start Date</label>
                <input 
                  type="datetime-local" 
                  name="startDate" 
                  required 
                  min={now}
                  max={maxDate}
                  value={formData.startDate}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3" 
                  onChange={handleChange} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-rose-400">End Date</label>
                <input 
                  type="datetime-local" 
                  name="endDate" 
                  required 
                  min={formData.startDate || now}
                  max={maxDate}
                  value={formData.endDate}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3" 
                  onChange={handleChange} 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Venue Name & Address</label>
                <input type="text" name="venueName" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3" onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Tickets */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-400 flex items-center gap-2 border-b border-slate-800 pb-2">
              <Ticket size={20} /> Pricing & Seats
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Total Tickets</label>
                <input type="number" name="totalCapacity" required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3" onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Price (Rs.)</label>
                <input 
                  type="number" 
                  name="ticketPrice" 
                  placeholder="e.g. 500"
                  disabled={formData.isFree} 
                  value={formData.isFree ? "" : formData.ticketPrice} 
                  className={`w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 ${formData.isFree ? 'opacity-30' : ''}`} 
                  onChange={handleChange} 
                />
              </div>
              <div className="flex items-center mt-8 cursor-pointer">
                <input type="checkbox" name="isFree" id="isFree" className="w-5 h-5 accent-blue-600" onChange={handleChange} />
                <label htmlFor="isFree" className="ml-3 font-medium">Free Entry</label>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3">
              {loading ? <Loader2 className="animate-spin" /> : (eventToEdit ? <Edit3 size={22} /> : <PlusCircle size={22} />)}
              {loading ? (eventToEdit ? "Updating..." : "Publishing...") : (eventToEdit ? "Update Event" : "Publish Event Now")}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
