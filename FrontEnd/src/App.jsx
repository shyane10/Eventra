// src/App.jsx
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// CUSTOMER PAGES
import Login from "./pages/customer/Login";
import Register from "./pages/customer/Register";
import VerifyOtp from "./pages/customer/VerifyOtp";
import ForgotPassword from "./pages/customer/ForgetPassword"; 
import ResetPassword from "./pages/customer/ResetPassword"; 

import Navbar from "./components/Nav";
import Footer from "./components/Footer";
import Home from "./pages/customer/Home";
import Book from "./pages/customer/Book"; 
import Contact from "./pages/customer/Contact";
import UpcomingEvents from "./pages/customer/UpcomingEvents";
import PastEvents from "./pages/customer/PastEvents";
import Shop from "./pages/customer/Shop";
import Category from "./pages/customer/Category";
import UserHistory from "./pages/customer/UserHistory";
import PaymentSuccess from "./pages/customer/PaymentSuccess";

// ORGANIZER PAGES
import OrganizerDB from "./pages/organizer/OrganizerDB";
import CreateEvent from "./pages/organizer/CreateEvent";
import CreateProduct from "./pages/organizer/CreateProduct";
import AdminHome from "./pages/admin/AdminHome";

// ADMIN PAGES


const LayoutWrapper = ({ children }) => {
  const location = useLocation();

  // Added /admin-dashboard to this list
  const hideLayoutPaths = [
    "/", 
    "/register", 
    "/verify-otp", 
    "/forgot-password", 
    "/reset-password",
    "/organizer-home", 
    "/create-event",
    "/create-product",
    "/admin-dashboard" 
  ];
  
  const shouldHide = hideLayoutPaths.includes(location.pathname);

  return (
    <>
      {!shouldHide && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!shouldHide && <Footer />}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <LayoutWrapper>
        <Routes>
          {/* --- AUTH ROUTES --- */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* --- CUSTOMER / USER ROUTES --- */}
          <Route path="/home" element={<Home />} />
          <Route path="/booking" element={<Book />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/category" element={<Category />} />
          <Route path="/history" element={<UserHistory />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          
          <Route path="/events/upcoming" element={<UpcomingEvents />} />
          <Route path="/events/past" element={<PastEvents />} />

          {/* --- ORGANIZER ROUTES --- */}
          <Route path="/organizer-home" element={<OrganizerDB />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/create-product" element={<CreateProduct />} />

          {/* --- ADMIN ROUTES --- */}
          <Route path="/admin-dashboard" element={<AdminHome />} />
        </Routes>
      </LayoutWrapper>
    </BrowserRouter>
  );
}

export default App;