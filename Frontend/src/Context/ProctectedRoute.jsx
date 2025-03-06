import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext"; 
import { Navigate } from "react-router-dom"; 

// ProtectedRoute component to guard routes based on authentication and roles
const ProtectedRoute = ({ children, roles }) => {
  // Accessing user data and loading state from AuthContext
  const { user, loading } = useContext(AuthContext);

  // If the app is still loading user authentication data, display a loading indicator
  if (loading) {  
    return <div>Loading...</div>;
  }

  console.log("ProtectedRoute user:", user); // Debugging user information
  console.log("Allowed roles:", roles); // Debugging the roles allowed to access this route

  // If no authenticated user is found, redirect to the login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Check if the user's role matches any of the allowed roles (if roles are specified)
  if (roles && !roles.map((role) => role.toLowerCase()).includes(user.role.toLowerCase())) {
    console.warn("Unauthorized access attempt by role:", user.role); // Log a warning for unauthorized access
    return <Navigate to="/" />; // Redirect to the homepage or another fallback page
  }

  // If all checks pass, render the child components
  return children;
};

export default ProtectedRoute;
