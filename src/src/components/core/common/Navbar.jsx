import React, { useEffect } from "react";
import { Link, useLocation, matchPath } from "react-router-dom";
import { ProfileDropDown } from "../Auth_frontend/ProfileDropDown";
import { FiSearch, FiShoppingCart } from "react-icons/fi";
import { FaAngleDown } from "react-icons/fa";
import { NavbarLinks } from "../../../pages/data/navbar-links"; // adjust path if needed
import { useDispatch, useSelector } from "react-redux";
import { CoursecategoryData } from "../../../Slices/courseSlice";

const Navbar = () => {
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const { categorydata, loading, error } = useSelector((state) => state.course);

  //  1. Get current route
  const location = useLocation();

  //  2. Route match helper
  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  //  3. Fetch categories only once (Redux)
  useEffect(() => {
    if (!categorydata || categorydata.length === 0) {
      dispatch(CoursecategoryData());
    }
  }, [dispatch, categorydata]);

  return (
    <div className="w-full bg-[#1e2a3b] border-b z-50 border-[#1e2a3b]">
      <div className="mx-auto flex h-14 max-w-maxContent items-center justify-between px-6">
        {/* ---------------- LOGO ---------------- */}
        <Link to="/">
          <img
            src="/Logo/Logo-Full-Light.png"
            alt="Logo"
            className="h-8 object-contain"
          />
        </Link>

        {/* ---------------- NAV LINKS ---------------- */}
        <div className="flex items-center gap-8 text-sm">
          {NavbarLinks.map((link, index) => {
            // ====== CATALOG DROPDOWN ======
            if (link.title === "Catalog") {
              return (
                <div key={index} className="relative group">
                  <p className="cursor-pointer text-white gap-1 items-center flex hover:text-yellow-300 group">
                    {link.title}
                    <FaAngleDown />
                    <div
                      className="invisible absolute left-1/2 top-full z-50 mt-3 
                      -translate-x-1/2 
                      flex flex-col rounded-lg bg-white p-4 
                      text-black opacity-0 
                      transition-all duration-200   
                      group-hover:visible group-hover:opacity-100 
                      lg:w-75"
                    >
                      {/* Triangle */}
                      <div
                        className="absolute -top-2 left-1/2 
                        h-4 w-4
                        -translate-x-[-10%] 
                        rotate-45 
                        bg-white"
                      ></div>

                      {/* Content */}
                      {/* Content */}
                      {loading && (
                        <p className="px-3 py-1 text-sm text-gray-500">
                          Loading.....
                        </p>
                      )}

                      {error && (
                        <p className="px-3 py-1 text-sm text-red-500">
                          {error?.message || "Failed to load categories"}
                        </p>
                      )}

                      {!loading &&
                        !error &&
                        categorydata?.map((category) => (
                          <Link
                            key={category._id}
                            to={`/catalog/${category.name}`}
                            className="block px-3 py-1 text-sm hover:text-yellow-400"
                          >
                            {category.name}
                          </Link>
                        ))}
                    </div>
                  </p>
                </div>
              );
            }

            // ====== NORMAL LINKS ======
            return (
              <Link
                key={index}
                to={link.path}
                className={`transition ${
                  matchRoute(link.path)
                    ? "text-yellow-300"
                    : "text-white hover:text-yellow-300"
                }`}
              >
                {link.title}
              </Link>
            );
          })}
        </div>

        {/* ---------------- RIGHT SECTION ---------------- */}
        <div className="flex items-center gap-4">
          <FiSearch className="cursor-pointer text-white" size={18} />

          {/* CART (only if user exists and not Instructor) */}
          {user && user.accountType !== "instructor" && (
            <Link
              to="/dashboard/cart"
              className="relative cursor-pointer text-white"
            >
              <FiShoppingCart size={18} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full px-1">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {/* AUTH BUTTONS */}
          {token === null && (
            <>
              <Link to="/signup">
                <button className="rounded-md border border-[#98ADBD] px-4 py-1.5 text-sm text-white hover:bg-[#98ADBD] hover:text-black transition">
                  Signup
                </button>
              </Link>
              <Link to="/Login">
                <button className="rounded-md border border-[#98ADBD] px-4 py-1.5 text-sm text-white hover:bg-[#98ADBD] hover:text-black transition">
                  Login
                </button>
              </Link>
            </>
          )}

          {token !== null && <ProfileDropDown />}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
