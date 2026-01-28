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
      <div className="flex">
        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="fixed top-18 left-0    text-white p-2 rounded-md cursor-pointer"
          >
            <FiSidebar size={22} />
          </button>
        )}

        <aside
          className={`w-67 min-h-screen bg-[#0f151f] border-r border-slate-800 px-4 py-6   transition-transform duration-300 ease-in-out text-white ${open ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex space-x-20  space-y-2  justify-center">
            <h2 className="mb-6  text-xl font-semibold  text-white">
              Admin Pannel
            </h2>
            <div onClick={() => setOpen(open)} className="cursor-pointer">
              <GiCrossedBones />
            </div>
          </div>

          {/* Left Part */}
          <div className="space-y-2">
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
        </aside>

        <div className="  flex flex-1 p-1">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
