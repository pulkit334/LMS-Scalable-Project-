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
    <header className="sticky top-0 w-full bg-[#0b1220]/85 backdrop-blur-md border-b border-white/[0.08] z-50 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* ---------------- LOGO ---------------- */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img
            src="/Logo/Logo-Full-Light.png"
            alt="Logo"
            className="h-8 object-contain"
          />
        </Link>

        {/* ---------------- DESKTOP NAV ---------------- */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          {NavbarLinks.map((link, index) => {
            if (link.title === "Catalog") {
              return (
                <div key={index} className="relative group py-2">
                  <Link
                    to="/catalog"
                    className="cursor-pointer text-slate-200 gap-1.5 items-center flex hover:text-amber-300 transition-colors"
                  >
                    {link.title}
                    <FaAngleDown className="text-xs transition-transform duration-200 group-hover:rotate-180" />
                  </Link>

                  <div
                    className="invisible absolute left-1/2 top-full z-50 pt-2
                    -translate-x-1/2
                    opacity-0 transition-all duration-200
                    group-hover:visible group-hover:opacity-100
                    w-64"
                  >
                    <div className="flex flex-col rounded-xl bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 p-2 text-slate-200 shadow-2xl shadow-black/50">
                      {loading && (
                        <p className="px-3 py-2 text-xs text-slate-400">
                          Loading categories...
                        </p>
                      )}
                      {error && (
                        <p className="px-3 py-2 text-xs text-rose-400">
                          {error?.message || "Failed to load categories"}
                        </p>
                      )}
                      {!loading &&
                        !error &&
                        categorydata?.map((category) => (
                          <Link
                            key={category._id}
                            to={`/catalog/${category.name}`}
                            className="block rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-white/[0.06] hover:text-amber-300 transition-colors"
                          >
                            {category.name}
                          </Link>
                        ))}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={index}
                to={link.path}
                className={`transition-colors py-1 ${
                  matchRoute(link.path)
                    ? "text-amber-300 font-semibold"
                    : "text-slate-200 hover:text-amber-300"
                }`}
              >
                {link.title}
              </Link>
            );
          })}
        </nav>

        {/* ---------------- RIGHT SECTION DESKTOP ---------------- */}
        <div className="hidden md:flex items-center gap-3">
          {token === null ? (
            <>
              <Link
                to="/Login"
                className="text-slate-200 hover:text-white border border-white/10 hover:border-white/25 px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="bg-amber-400 text-slate-950 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-amber-300 shadow-sm shadow-amber-400/20 transition-all"
              >
                Sign up
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              {/* ---------------- NOTIFICATION BELL ---------------- */}
              <div className="relative  inline-block">
                <button
                  onClick={() => setShowNotification(!showNotification)}
                  className="text-white hover:text-yellow-300 relative"
                >
                  <IoIosNotifications size={24} />
                  {UserNotification?.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {UserNotification.length}
                    </span>
                  )}
                </button>
                {showNotification && (
                  <div className="absolute right-0 top-full mt-2 z-50">
                    <NotificationModal
                      notifications={UserNotification}
                      onClose={() => setShowNotification(false)}
                    />
                  </div>
                )}
              </div>
              {/* ---------------- CART (Students only) ---------------- */}
              {user?.accountType?.toLowerCase() === "student" && (
                <Link
                  to="/dashboard/cart"
                  className="relative text-slate-200 hover:text-amber-300 transition-colors"
                >
                  <FiShoppingCart size={20} />
                  {totalItems > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-slate-950 font-bold text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
              )}
              <ProfileDropDown />
            </div>
          )}
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
        <div className="md:hidden bg-[#0f172a] px-6 py-4 space-y-4 border-t border-white/10">
          {NavbarLinks.map((link, index) => {
            if (link.title === "Catalog") {
              return (
                <div key={index}>
                  <div className="flex items-center justify-between text-white">
                    <Link
                      to="/catalog"
                      onClick={() => setMobileOpen(false)}
                      className="hover:text-yellow-300"
                    >
                      {link.title}
                    </Link>
                    <FaAngleDown
                      onClick={() => setMobileCatalogOpen(!mobileCatalogOpen)}
                      className={`cursor-pointer transition-transform ${
                        mobileCatalogOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {mobileCatalogOpen && (
                    <div className="mt-2 ml-4 space-y-2">
                      {loading && (
                        <p className="text-sm text-gray-400">Loading...</p>
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

          {/* Mobile Login/Signup or Profile */}
          {token === null ? (
            <>
              <Link
                to="/signup"
                className="block text-white hover:text-yellow-300"
              >
                Signup
              </Link>
              <Link
                to="/Login"
                className="block text-white hover:text-yellow-300"
              >
                Login
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              {/* ---------------- MOBILE NOTIFICATION ---------------- */}
              <div className="relative">
                <button
                  onClick={() => setShowNotification(!showNotification)}
                  className="text-white hover:text-yellow-300 relative"
                >
                  <IoIosNotifications size={24} />
                  {UserNotification?.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {UserNotification.length}
                    </span>
                  )}
                </button>
                {showNotification && (
                  <NotificationModal
                    notifications={UserNotification}
                    onClose={() => setShowNotification(false)}
                  />
                )}
              </div>
              {/* ---------------- MOBILE CART (Students only) ---------------- */}
              {user?.accountType?.toLowerCase() === "student" && (
                <Link
                  to="/dashboard/cart"
                  className="relative text-slate-200 hover:text-amber-300"
                >
                  <FiShoppingCart size={20} />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 font-bold text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
              )}
              <ProfileDropDown />
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
