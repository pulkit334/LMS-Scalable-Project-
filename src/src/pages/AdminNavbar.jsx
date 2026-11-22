import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ShieldCheck, ExternalLink } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ProfileMenu } from "../components/core/Auth_frontend/ProfileBar_modal/ProfilePopup";

const AdminNavbar = () => {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.profile);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : "Admin";

  const avatarUrl =
    user?.image?.url ||
    `https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(displayName)}`;

  return (
    <header className="sticky top-0 z-40 h-16 w-full flex items-center justify-between bg-[#0d1017]/95 backdrop-blur-md border-b border-white/[0.07] px-6 text-slate-100">
      {/* LEFT BRAND */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-500/15 border border-indigo-400/30 text-indigo-400">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="leading-tight">
          <span className="font-semibold text-sm tracking-tight text-white block">
            Notion-X Console
          </span>
          <span className="text-[11px] text-slate-500 block">
            Administration
          </span>
        </div>
      </div>

      {/* RIGHT CONTROLS */}
      <div className="flex items-center gap-4">
        <Link
          to="/catalog"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-100 border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] px-3 py-1.5 rounded-lg transition"
        >
          <span>View Storefront</span>
          <ExternalLink className="w-3 h-3" />
        </Link>

        <div ref={menuRef} className="relative">
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 hover:bg-white/[0.05] border border-transparent hover:border-white/[0.08] transition cursor-pointer"
          >
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-white/15"
            />
            <div className="hidden sm:block text-left leading-tight">
              <span className="text-xs font-medium text-slate-100 block">
                {displayName}
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                Admin
              </span>
            </div>
            <ChevronDown
              size={14}
              className={`text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>

          {open && <ProfileMenu />}
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
