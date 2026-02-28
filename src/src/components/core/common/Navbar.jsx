/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link, useLocation, matchPath } from "react-router-dom";
import { ProfileDropDown } from "../Auth_frontend/ProfileDropDown";
import { FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import { FaAngleDown } from "react-icons/fa";
import { NavbarLinks } from "../../../pages/data/navbar-links";
import { useDispatch, useSelector } from "react-redux";
import { CoursecategoryData } from "../../../Slices/courseSlice";
import { IoIosNotifications } from "react-icons/io";
import NotificationModal from "../../../utils/NotificationModal";

const Navbar = () => {
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const { categorydata, loading, error } = useSelector((state) => state.course);
  const { UserNotification } = useSelector((state) => state.usernotification);

  const [showNotification, setShowNotification] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCatalogOpen, setMobileCatalogOpen] = useState(false);

  const location = useLocation();

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

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

        {/* ---------------- DESKTOP NAV ---------------- */}
        <div className="hidden md:flex items-center gap-8 text-sm">
          {NavbarLinks.map((link, index) => {
            if (link.title === "Catalog") {
              return (
                <div key={index} className="relative group">
                  <Link
                    to="/catalog"
                    className="cursor-pointer text-white gap-1 items-center flex hover:text-yellow-300"
                  >
                    {link.title}
                    <FaAngleDown />
                  </Link>

                  <div
                    className="invisible absolute left-1/2 top-full z-50 mt-3 
                    -translate-x-1/2 
                    flex flex-col rounded-lg bg-white p-4 
                    text-black opacity-0 
                    transition-all duration-200   
                    group-hover:visible group-hover:opacity-100 
                    w-72"
                  >
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
                </div>
              );
            }

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

        {/* ---------------- RIGHT SECTION DESKTOP ---------------- */}
        <div className="hidden md:flex items-center gap-4">
          {token !== null && <ProfileDropDown />}
        </div>

        {/* ---------------- MOBILE MENU BUTTON ---------------- */}
        <div className="md:hidden text-white">
          <button onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* ---------------- MOBILE MENU ---------------- */}
      {mobileOpen && (
        <div className="md:hidden bg-[#1e2a3b] px-6 py-4 space-y-4 border-t border-gray-700">

          {NavbarLinks.map((link, index) => {

            if (link.title === "Catalog") {
              return (
                <div key={index}>
                  <div className="flex items-center justify-between text-white">
                    <Link
                      to="/catalog"
                      onClick={() => {
                        setMobileOpen(false);
                      }}
                      className="hover:text-yellow-300"
                    >
                      {link.title}
                    </Link>

                    <FaAngleDown
                      onClick={() =>
                        setMobileCatalogOpen(!mobileCatalogOpen)
                      }
                      className={`cursor-pointer transition-transform ${
                        mobileCatalogOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {mobileCatalogOpen && (
                    <div className="mt-2 ml-4 space-y-2">
                      {loading && (
                        <p className="text-sm text-gray-400">
                          Loading...
                        </p>
                      )}

                      {error && (
                        <p className="text-sm text-red-500">
                          {error?.message || "Failed to load categories"}
                        </p>
                      )}

                      {!loading &&
                        !error &&
                        categorydata?.map((category) => (
                          <Link
                            key={category._id}
                            to={`/catalog/${category.name}`}
                            onClick={() => setMobileOpen(false)}
                            className="block text-sm text-gray-300 hover:text-yellow-300"
                          >
                            {category.name}
                          </Link>
                        ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={index}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className="block text-white hover:text-yellow-300"
              >
                {link.title}
              </Link>
            );
          })}

          {token === null && (
            <>
              <Link to="/signup" className="block text-white">
                Signup
              </Link>
              <Link to="/Login" className="block text-white">
                Login
              </Link>
            </>
          )}

          {token !== null && <ProfileDropDown />}
        </div>
      )}
    </div>
  );
};

export default Navbar;