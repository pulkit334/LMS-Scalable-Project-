/* eslint-disable react-hooks/static-components */
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.profile.user);
  const Navigate = useNavigate();
  if (!token) return Navigate("/login");
  console.log("the login accountType is ", user);

  return children;
};

export default AdminRoute;
