import { Outlet } from "react-router-dom";

const Admin = () => {
  console.log("the Router is hitting back to me")
  return (
<Outlet/>

  );
};

export default Admin;
