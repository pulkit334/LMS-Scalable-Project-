import { Outlet } from "react-router-dom";
import AdminNavbar from "../AdminNavbar";
const Admin = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#090b10]">
      <AdminNavbar />
      <main className="flex-1 bg-[#090b10] overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Admin; 
