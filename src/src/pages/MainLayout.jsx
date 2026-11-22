import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/core/common/Navbar";
import GlobalLiveBanner from "../components/LiveClass/GlobalLiveBanner";

const MainLayout = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar />}
      <Outlet />
      {!isAdmin && <GlobalLiveBanner />}
    </>
  );
};

export default MainLayout;
