import { Outlet } from "react-router-dom";
import AdminNavbar from "../AdminNavbar";
const Admin = () => {
return (
    <>
      <AdminNavbar />
      <main className="flex-1 bg-[#020617] overflow-y-auto">
        <Outlet />
      </main>
    </>
  );
};

export default Admin; 
