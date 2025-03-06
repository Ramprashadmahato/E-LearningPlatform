import { createContext, useState, useEffect } from "react";

// Create the context to manage authentication globally
export const AuthContext = createContext();

// Create the provider component that wraps the app and provides authentication-related data and methods
const AuthProvider = ({ children }) => {
  // Retrieve stored user details from localStorage if available
  const storedToken = localStorage.getItem("token");
  const storedRole = localStorage.getItem("role");
  const storedName = localStorage.getItem("name");
  const storedEmail = localStorage.getItem("email");

  // State to store the authenticated user data
  const [user, setUser] = useState(
    storedToken ? { token: storedToken, role: storedRole, name: storedName, email: storedEmail } : null
  );

  // State to manage the loading state during the initial user authentication check
  const [loading, setLoading] = useState(true);

  // Function to fetch user details from the API using the token
  const fetchUser = async (token) => {
    try {
      const response = await fetch("http://localhost:3000/api/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("API Response:", data);

        // Save user details in localStorage for persistence
        localStorage.setItem("role", data.role);
        localStorage.setItem("name", data.name);
        localStorage.setItem("email", data.email);

        // Update the user state
        setUser({ token, name: data.name, email: data.email, role: data.role });
      } else {
        // If token is invalid, clear localStorage and reset state
        logout();
      }
    } catch (err) {
      console.error("Error:", err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Effect to check for an existing token in localStorage and authenticate the user on initial load
  useEffect(() => {
    if (storedToken && !user) {
      fetchUser(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  // Function to handle user login, update localStorage, and update the state
  const login = (token, role, name, email) => {
    // Save token and user details to localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("name", name);
    localStorage.setItem("email", email);

    // Update the user state
    setUser({ token, role, name, email });
  };

  // Function to handle user logout, clear localStorage, and reset the state
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("email");

    setUser(null);
  };

  // Provide the context values to child components
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
