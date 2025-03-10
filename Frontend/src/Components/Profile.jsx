import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../Context/AuthContext"; 
import BackgroundImage from "../Image/Bg4.png";
const Profile = () => {
  const { user, loading } = useContext(AuthContext);
  const [users, setUsers] = useState([]); 
  const [error, setError] = useState("");

  // Fetch all users if the user is Admin or Recruiter
  useEffect(() => {
    if (user && (user.role === "Admin" || user.role === "Recruiter")) {
      const fetchUsers = async () => {
        try {

          const response = await fetch("http://localhost:3000/api/users", {
            headers: {
              Authorization: `Bearer ${user.token}`
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch users.");
          }

          const data = await response.json();
          setUsers(data);
        } catch (err) {
          setError(err.message); 
        }
      };

      fetchUsers();
    }
  }, [user]); 
  // Loading spinner while the data is being fetched
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Unauthorized message if no user is logged in
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600">
            Please log in to view your profile.
          </h2>
        </div>
      </div>
    );
  }

  // Role badge component to display user's role with specific colors
  const RoleBadge = ({ role }) => {
    const roleColors = {
      Admin: "bg-red-500 text-white", 
      Recruiter: "bg-blue-500 text-white", 
      Participant: "bg-green-500 text-white", 
    };

    return (
      <span
        className={`text-sm px-2 py-1 rounded-full font-semibold ${roleColors[role]}`}
      >
        {role}
      </span>
    );
  };

  return (
    <div className=" bg-cover min-h-screen p-8"  style={{
                    backgroundImage: `url(${BackgroundImage})`, 
                }}>
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold text-green-700 mb-6 text-center">
          {user.name} Profile
        </h1>
        <p className="text-lg text-gray-700 mb-4 text-center">
          <strong>Email:</strong> {user.email}
        </p>
        <p className="text-lg text-gray-700 mb-8 text-center">
          <strong>Role:</strong> <RoleBadge role={user.role} />
        </p>

        {/* If user is Admin or Recruiter, show the list of all users */}
        {(user.role === "Admin" || user.role === "Recruiter") && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">All Users</h2>

            {/* Display error message if fetching users fails */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                <strong className="font-bold">Error:</strong> {error}
              </div>
            )}

            {/* Display all users in a grid layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="bg-white border border-gray-200 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow transform hover:scale-105"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                      {user.name.charAt(0).toUpperCase()} {/* Display first letter of user's name */}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-bold text-gray-900">
                        {user.name}
                      </h3>
                      <RoleBadge role={user.role} /> {/* Display the user's role badge */}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-2">
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p className="text-gray-700">
                    <strong>Role:</strong> {user.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
