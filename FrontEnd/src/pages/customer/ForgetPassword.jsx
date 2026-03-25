// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const ForgotPassword = () => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   const handleReset = (e) => {
//     e.preventDefault();

//     // get users from localStorage
//     const users = JSON.parse(localStorage.getItem("eventraUsers")) || [];

//     // find user by email
//     const userIndex = users.findIndex((u) => u.email === email);

//     if (userIndex === -1) {
//       alert("Email not registered");
//       return;
//     }

//     if (newPassword.length < 4) {
//       alert("Password should be at least 4 characters");
//       return;
//     }

//     // update password
//     users[userIndex].password = newPassword;
//     localStorage.setItem("eventraUsers", JSON.stringify(users));

//     alert("Password reset successful! Please login with your new password.");
//     navigate("/");
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
//       <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl text-white">
//         <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>

//         <form onSubmit={handleReset} className="space-y-4">
//           <input
//             type="email"
//             name="email"
//             placeholder="Registered Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             className="w-full px-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
//           />

//           <div className="relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               name="newPassword"
//               placeholder="New Password"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               required
//               className="w-full px-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-2 text-blue-500 text-sm"
//             >
//               {showPassword ? "Hide" : "Show"}
//             </button>
//           </div>

//           <button className="w-full py-2 bg-blue-600 rounded-lg hover:bg-blue-700">
//             Reset Password
//           </button>
//         </form>

//         <p className="text-center text-slate-400 mt-4 text-sm">
//           Remembered your password?{" "}
//           <button
//             onClick={() => navigate("/")}
//             className="text-blue-500 hover:underline"
//           >
//             Login Here
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;