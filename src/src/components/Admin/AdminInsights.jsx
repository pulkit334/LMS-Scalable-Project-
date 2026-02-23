/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import { useDispatch, useSelector } from "react-redux";
import { FiSidebar } from "react-icons/fi";
import { GiCrossedBones } from "react-icons/gi";
import Result from "../../utils/Spinnre";
import { AdminSideBarLink } from "../../pages/data/admin-link";
import SidebarLink from "../core/Dashboard/SidebarLink";
import { useState } from "react";
import AdminInsightPage from "./Admin-Components/AdminInsightPage";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const { user, loading: userLoading } = useSelector((state) => state.profile);
  if (userLoading) {
    return <Result text="Loading...." loading={true} />;
  }

  const [open, setOpen] = useState(true);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .admin-layout { font-family: 'DM Sans', sans-serif; }
        .sidebar-toggle-btn {
          background: #fff;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          transition: all 0.2s ease;
        }
        .sidebar-toggle-btn:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.12); }
      `}</style>

      <div className="admin-layout flex min-h-screen" style={{ background: "#f8fafc" }}>

        {/* TOGGLE BUTTON when sidebar is closed */}
        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="sidebar-toggle-btn fixed top-20 left-3 z-50 p-2 rounded-lg text-slate-600 cursor-pointer"
          >
            <FiSidebar size={18} />
          </button>
        )}

        {/* SIDEBAR */}
        <aside
          className={`w-64 min-h-screen flex-shrink-0 transition-all duration-300 ease-in-out ${open ? "translate-x-0" : "-translate-x-full w-0 overflow-hidden"}`}
          style={{
            background: "#ffffff",
            borderRight: "1px solid #e2e8f0",
            boxShadow: "1px 0 8px rgba(0,0,0,0.04)",
          }}
        >
          <div className="px-5 py-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#94a3b8" }}>
                  Dashboard
                </p>
                <h2 className="text-base font-bold" style={{ color: "#0f172a", letterSpacing: "-0.01em" }}>
                  Admin Panel
                </h2>
              </div>
              <button
                onClick={() => setOpen(!open)}
                className="w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer transition"
                style={{ background: "#f1f5f9", color: "#64748b" }}
                onMouseEnter={e => e.currentTarget.style.background = "#e2e8f0"}
                onMouseLeave={e => e.currentTarget.style.background = "#f1f5f9"}
              >
                <GiCrossedBones size={12} />
              </button>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "#f1f5f9", marginBottom: 16 }} />

            {/* Left Part */}
            <div className="space-y-1">
              {AdminSideBarLink.map((link) => {
                if (link.type && link.type !== user?.accountType) {
                  return null;
                } else {
                  return (
                    <SidebarLink
                      key={link.id}
                      link={link}
                      iconsName={link.icon}
                    />
                  );
                }
              })}
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <div className="flex flex-1 min-w-0 overflow-auto">
          <Outlet />
        </div>

      </div>
    </>
  );
};

export default AdminLayout;
