import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  const loading = useSelector((state) => state.auth.loading);

  // hydrated
  if (loading) {
    return <div className="mt-10 text-center">Loading...</div>;
  }

  // not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // logged in
  return children;
};

export default PrivateRoute;
