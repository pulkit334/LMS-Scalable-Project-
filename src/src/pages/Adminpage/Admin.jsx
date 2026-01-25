import { Outlet } from "react-router-dom";
import AdminNavbar from "../AdminNavbar";
const Admin = () => {
  console.log("the Router is hitting back to me");
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
