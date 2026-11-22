/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";
import {
  BarChart3,
  Users,
  GraduationCap,
  BookOpen,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import Result from "../../utils/Spinnre";

const ADMIN_NAV_ITEMS = [
  { id: 1, name: "Insights", path: "/admin/insight", icon: BarChart3 },
  {
    id: 2,
    name: "Instructors",
    path: "/admin/instructors",
    icon: GraduationCap,
  },
  { id: 3, name: "Users", path: "/admin/users", icon: Users },
  { id: 4, name: "Courses", path: "/admin/courses", icon: BookOpen },
];

const AdminLayout = () => {
  const { loading: userLoading } = useSelector((state) => state.profile);
  const [open, setOpen] = useState(true);

  if (userLoading) {
    return <Result text="Loading...." loading={true} />;
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full bg-[#090b10] text-slate-100">
      {/* Reopen button when collapsed */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open sidebar"
          className="fixed top-20 left-3 z-40 p-2 rounded-lg bg-[#11151f] border border-white/10 text-slate-300 hover:text-white hover:border-white/20 shadow-xl cursor-pointer transition"
        >
          <PanelLeftOpen className="w-4 h-4" />
        </button>
      )}

      {/* SIDEBAR */}
      <aside
        className={`flex-shrink-0 bg-[#0d1017] border-r border-white/[0.07] transition-all duration-200 overflow-hidden ${
          open ? "w-60" : "w-0 border-r-0"
        }`}
      >
        <div className="w-60 px-4 py-5 flex flex-col h-full">
          <div className="flex items-center justify-between px-2 mb-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                Workspace
              </p>
              <h2 className="text-sm font-semibold text-slate-100 mt-0.5">
                Admin Controls
              </h2>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Collapse sidebar"
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/[0.06] cursor-pointer transition"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>

          <nav className="space-y-1">
            {ADMIN_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition ${
                      isActive
                        ? "bg-white/[0.08] text-white border border-white/[0.08]"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent"
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 px-2">
            <div className="rounded-xl bg-[#11151f] border border-white/[0.06] p-3">
              <p className="text-[11px] font-medium text-slate-300">
                System Status
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-[11px] text-slate-400">
                  API &amp; Queues Operational
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 min-w-0 bg-[#090b10] overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
