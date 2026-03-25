// src/App.jsx
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/customer/Login";
import Register from "./pages/customer/Register";
import VerifyOtp from "./pages/customer/VerifyOtp";
import Navbar from "./components/Nav";
import Home from "./pages/customer/Home"

// A helper component to handle conditional rendering of the Navbar
const NavigationWrapper = () => {
  const location = useLocation();

  // Define paths where you DON'T want the navbar to appear
  // Added "/verify-otp" to this list so it stays hidden there
  const hideNavbarPaths = ["/", "/register", "/verify-otp"];
  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

  return !shouldHideNavbar ? <Navbar /> : null;
};

function App() {
  return (
    <BrowserRouter>
      {/* Navbar wrapper */}
      <NavigationWrapper />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/home" element={<Home />} />
        {/* Add more routes later as needed */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;