// import React from "react";
// import { Link } from "react-router-dom";
// import { FiSearch, FiShoppingCart } from "react-icons/fi";

// const Navbar = () => {
//   return (
//     <div className="w-full bg-[#2C333F] border-b border-richblack-700">
//       <div className="mx-auto flex h-14 max-w-maxContent items-center justify-between px-6">
//         {/* Left Section - Logo */}
//         <Link to="/">
//           <div className="flex items-center gap-5">
//             <img
//               src="/Logo/Logo-Full-Light.png"
//               alt="Logo"
//               className="h-8 object-contain"
//             />
//           </div>
//         </Link>
//         {/* Center Section */}
//         <div className="hidden md:flex items-center gap-8 text-sm text-richblack-100">
//           <Link to="/" className="text-white">
//             Home
//           </Link>

//           <div className="relative group ">
//             <span className="cursor-pointer  text-yellow-300">Catalog</span>
//             <div className="absolute left-0 top-8 hidden w-40 rounded-md bg-richblack-800 p-2 group-hover:block">
//               <p className="px-3 py-2 text-white rounded">Web Dev</p>
//               <p className="px-3 py-2 text-white rounded">DSA</p>
//             </div>
//           </div>

//           <Link to="/about" className="text-white">
//             About us
//           </Link>
//           <Link to="/contact" className="text-white">
//             Contact us
//           </Link>
//         </div>

//         {/* Right Section */}
//         <div className="flex items-center gap-4 justify-around text-richblack-100">
//           <FiSearch className="cursor-pointer text-white" size={18} />
//           <FiShoppingCart className="cursor-pointer text-white" size={18} />

//           <Link to="/signup">
//             <button className="rounded-md cursor-pointer border border-[#98ADBD] px-4 py-1.5 text-sm text-white">
//               Sign 
//             </button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;
