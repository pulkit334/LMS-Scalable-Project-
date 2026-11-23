import React, { useState } from "react";
import { sidebarLinks } from "../../../pages/data/dashboard-links";
import { logout } from "../../../Slices/authslice";
import { useSelector, useDispatch } from "react-redux";
import SidebarLink from "./SidebarLink";
import { useNavigate } from "react-router-dom";
import { VscSignOut } from "react-icons/vsc";
import { HiMenu, HiX } from "react-icons/hi";
import Confirmation from "../common/confirmmation";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { user, loading: profileLoading } = useSelector((state) => state.profile);
  const { loading: authLoading } = useSelector((state) => state.auth);

  if (profileLoading || authLoading) {
    return <div className="p-4 text-white">Loading...</div>;
  }

  const sidebarContent = (
    <aside className="flex flex-col w-64 h-full min-h-screen md:min-h-[calc(100vh-4rem)] bg-[#0f172a] border-r border-white/[0.08] px-4 py-6 text-white">
      {/* Header row with title + close button (close only on mobile) */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <button
          className="md:hidden text-slate-400 hover:text-white"
          onClick={() => setMobileOpen(false)}
          aria-label="Close sidebar"
        >
          <HiX className="text-xl" />
        </button>
      </div>

      {/* LINKS */}
      <div className="space-y-2">
        {sidebarLinks.map((link) => {
          if (link.type && link.type !== user?.accountType) return null;
          return (
            <SidebarLink key={link.id} link={link} iconsName={link.icon} />
          );
        })}
      </div>

      <div className="my-6 h-px bg-slate-800" />

      {/* SETTINGS */}
      <div className="space-y-2">
        <SidebarLink
          link={{ name: "Settings", path: "/dashboard/settings" }}
          iconsName="VscSettingsGear"
        />

        <button
          onClick={() =>
            setConfirmationModal({
              text1: "Are You Sure?",
              text2: "You will be logged out of your account",
              btn1text: "Logout",
              btn2text: "Cancel",
              btn1handler: () => dispatch(logout(navigate)),
              btn2handler: () => setConfirmationModal(null),
              flagAccountDelete: false,
            })
          }
          className="flex w-full items-center gap-x-3 rounded-md px-4 py-2 text-red-400 hover:bg-red-500/10"
        >
          <VscSignOut className="text-lg" />
          Logout
        </button>
      </div>

      {confirmationModal && <Confirmation modalData={confirmationModal} />}
    </aside>
  );

  return (
    <>
      {/* Hamburger button — mobile only */}
      <button
        className="fixed top-15 left-1 z-50 md:hidden flex items-center justify-center w-9 h-9 rounded-md bg-[#161D29] border border-slate-700 text-white"
        onClick={() => setMobileOpen((prev) => !prev)}
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <HiX className="text-xl" /> : <HiMenu className="text-xl" />}
      </button>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar drawer on mobile / sticky full-height on md+ */}
      <div
        className={`fixed top-0 left-0 z-40 h-full transition-transform duration-300
          md:sticky md:top-16 md:translate-x-0 md:h-[calc(100vh-4rem)] md:block shrink-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {sidebarContent}
      </div>
    </>
  );
};

export default Sidebar;