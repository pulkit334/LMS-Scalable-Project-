import React, { useState } from "react";
import { sidebarLinks } from "../../../pages/data/dashboard-links";
import { logout } from "../../../Slices/authslice";
import { useSelector, useDispatch } from "react-redux";
import SidebarLink from "./SidebarLink";
import { useNavigate } from "react-router-dom";
import { VscSignOut, VscSettingsGear } from "react-icons/vsc";
import Confirmation from "../common/confirmmation";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [confirmationModal, setConfirmationModal] = useState(null);

  const { user, loading: profileLoading } = useSelector(
    (state) => state.profile
  );
  const { loading: authLoading } = useSelector((state) => state.auth);

  if (profileLoading || authLoading) {
    return <div className="p-4 text-white">Loading...</div>;
  }

  return (
    <aside className="w-64 min-h-screen bg-[#161D29] border-r border-slate-800 px-4 py-6 text-white">
      <h2 className="mb-6 text-xl font-semibold">Dashboard</h2>

      {/* LINKS */}
      <div className="space-y-2">
        {sidebarLinks.map((link) => {
          if (link.type && link.type !== user?.accountType) {
            return null;
          }
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
              flagAccountDelete:false
            })
          }
          className="flex w-full items-center gap-x-3 rounded-md px-4 py-2 text-red-400 hover:bg-red-500/10"
        >
          <VscSignOut className="text-lg cursor-po" />
          Logout
        </button>
      </div>

      {confirmationModal && <Confirmation modalData={confirmationModal} />}
    </aside>
  );
};

export default Sidebar;
