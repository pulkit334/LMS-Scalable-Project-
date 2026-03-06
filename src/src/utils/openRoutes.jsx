import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const OpenRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.profile.user);
  const loading = useSelector((state) => state.profile.loading); // 👈 add this

  const role = user?.accountType?.trim()?.toLowerCase();

  // Wait until user data is resolved before making redirect decisions
  if (token && loading) {
    return null; // or a spinner
  }

  if (token && role === "admin") {
    return <Navigate to="/admin/insight" replace />;
  }

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default OpenRoute;