import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const OpenRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);

  // If logged in → redirect
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  // Else allow access
  return children;
};

export default OpenRoute;
