import React from "react";
import { ChevronDown } from "lucide-react";

const AdminNavbar = () => {
  return (
    <header className="h-16 w-full  flex border-b border-slate-800 text-white">
      
      {/* LEFT */}
      <div className="w-65 bg-[#20212d] flex items-center gap-3 px-6">
        <div className="w-8 h-8 flex items-center justify-center rounded-md bg-indigo-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="w-5 h-5 text-white"
          >
            <path
              fillRule="evenodd"
              d="M20 10H4v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8ZM9 13v-1h6v1a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1Z"
              clipRule="evenodd"
            />
            <path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 1 1 0 4H4a2 2 0 0 1-2-2Z" />
          </svg>
        </div>
        <span className="font-semibold tracking-wide">LMS Admin</span>
      </div>

      {/* CENTER */}
      <div className="flex-1 bg-linear-to-r from-[#222430] to-[#03071d] flex items-center justify-center">
        <h2 className="text-sm font-medium text-slate-300">
          LMS Admin Dashboard
        </h2>
      </div>

      {/* RIGHT */}
      <div className="w-65 bg-[#020617] flex items-center justify-end gap-3 px-6">
        <img
          src="https://i.pravatar.cc/40"
          alt="Admin"
          className="w-9 h-9 rounded-full border border-slate-700"
        />
        <span className="text-sm text-slate-200">Admin</span>
        <ChevronDown size={16} className="text-slate-400" />
      </div>

    </header>
  );
};

export default AdminNavbar;
