import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const OpenRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.profile.user);

  const role = user?.accountType?.trim()?.toLowerCase();

  if (token && role === "admin") {
    return <Navigate to="/admin/insight" replace />;
  }

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default OpenRoute;
