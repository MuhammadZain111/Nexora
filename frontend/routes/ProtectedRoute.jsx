import { Navigate } from "react-router-dom";
import { useAuth } from "../src/context/AuthContext";

function ProtectedRoute({ children }) {
 
  const { user, isCheckingAuth } = useAuth();

  if (isCheckingAuth) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
