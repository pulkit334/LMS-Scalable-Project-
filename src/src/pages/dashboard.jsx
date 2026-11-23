import React from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/core/Dashboard/sidebar";
import { ACCOUNT_TYPE } from "../utils/constants";
import AdminWarning from "../Warning/adminwarning";
import { Navigate } from "react-router-dom";
const Dashboard = () => {
  const { loading: authLoading } = useSelector((state) => state.auth);
  const { loading: profileLoading, user } = useSelector(
    (state) => state.profile
  );


  if (authLoading || profileLoading) {
    return <div className="mt-10 text-center">Loading...</div>;
  }


  if (user?.accountType === ACCOUNT_TYPE.ADMIN) {
  return <Navigate to="/admin/insight"/>;
}


  return (
    <div className="flex min-h-screen bg-linear-to-b from-[#020617] to-[#000814]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto px-10 py-10">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
