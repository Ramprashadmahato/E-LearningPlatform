import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaUserEdit, FaTrashAlt, FaUserCheck, FaUserTimes } from "react-icons/fa";

const UserManagement = () => {
  const [users, setUsers] = useState([]); 
  const [status, setStatus] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState(false); 

  // useEffect to fetch users from the backend when the component is mounted
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true); 
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/users", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, 
            "Content-Type": "application/json"
          },
        });

        if (!response.ok) {
          throw new Error("Error fetching users.");
        }

        const data = await response.json(); 
        setUsers(data);  
      } catch (error) {
        setStatus("Error fetching users."); 
      } finally {
        setLoading(false); 
      }
    };

    fetchUsers();
  }, []); 

  // Function to handle status change (activate/deactivate) for a user
  const handleStatusChange = async (userId, action) => {
    setActionInProgress(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/api/users/${userId}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`, 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }), // Send the action ("activate" or "deactivate") in the request body
      });
  
      const data = await response.json(); // Parse the API response
      if (!response.ok) {
        throw new Error(data.message || "Error changing user status.");
      }
  
      // Update the users list in the state based on the status change
      setUsers((prevUsers) => 
        prevUsers.map((user) => 
          user._id === userId ? { ...user, status: action === "activate" ? "active" : "inactive" } : user
        )
      );
  
      setStatus(`User ${action}d successfully.`); 
    } catch (error) {
      setStatus("Error updating user status."); 
    } finally {
      setActionInProgress(false); // Reset action in progress
    }
  };

  // Function to handle user deletion
  const handleDelete = async (userId) => {
    setActionInProgress(true); // Set action in progress state
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // Attach the token for authorization
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error deleting user.");
      }

      // Remove the deleted user from the state
      setUsers(users.filter((user) => user._id !== userId));
      setStatus("User deleted successfully."); // Set success message
    } catch (error) {
      setStatus("Error deleting user."); // Set error message if something goes wrong
    } finally {
      setActionInProgress(false); // Reset action in progress
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-semibold mb-8">User Management</h1>

        {/* Conditionally render status message */}
        {status && (
          <p className={`text-lg ${status.includes("Error") ? "text-red-600" : "text-green-600"}`}>{status}</p>
        )}

        {/* Conditionally render loading or no users message */}
        {loading ? (
          <div className="text-center text-lg font-semibold">Loading users...</div> // Show loading message while fetching
        ) : users.length === 0 ? (
          <div className="text-center text-lg text-gray-600">No users found.</div> // Show message if no users found
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user._id} className="flex justify-between items-center p-4 bg-white shadow-md rounded-md">
                <div>
                  <h3 className="font-semibold text-gray-800">{user.name}</h3>
                  <p className="text-gray-600">{user.email}</p>
                </div>

                <div className="flex space-x-4">
                  {/* Edit user button (navigates to the edit page) */}
                  <NavLink
                    to={`/edit/${user._id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaUserEdit className="text-xl" />
                  </NavLink>

                  {/* Status change button */}
                  <button
                    onClick={() => handleStatusChange(user._id, user.status === "active" ? "deactivate" : "activate")}
                    className={`py-2 px-4 rounded-md ${user.status === "active" ? "bg-green-600 text-white" : " bg-red-600 text-white"} hover:bg-opacity-80 transition duration-300`}
                    disabled={actionInProgress} // Disable button if an action is in progress
                  >
                    {user.status === "active" ? <FaUserCheck className="text-xl" /> : <FaUserTimes className="text-xl" />}
                  </button>

                  {/* Delete user button */}
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-opacity-80 transition duration-300"
                    disabled={actionInProgress} // Disable button if an action is in progress
                  >
                    <FaTrashAlt className="text-xl" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
