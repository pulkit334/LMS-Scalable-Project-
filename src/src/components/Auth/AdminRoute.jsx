import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.profile.user);

  if (!token) {
    return <Navigate to="/Login" replace />;
  }

  if (user && user.accountType?.toLowerCase() !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
