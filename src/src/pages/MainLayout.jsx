import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/core/common/Navbar";

const MainLayout = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar />}
      <Outlet />
    </>
  );
};

export default MainLayout;
