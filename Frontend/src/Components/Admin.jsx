import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { NavLink } from "react-router-dom"; 
import { FaPlusCircle, FaEye, FaUserEdit, FaChartLine } from "react-icons/fa"; 

const Admin = () => {
  // Destructure the user object from AuthContext to get user details
  const { user } = useContext(AuthContext);

  return (
    <div className="bg-cover bg-center h-screen p-8">
      {/* Main container for the admin dashboard */}
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-12">
          {/* Dashboard Title */}
          <h1 className="text-4xl font-bold text-gray-800 ml-[18rem]">Admin Dashboard</h1>
          {/* Display User Role */}
          <span className="bg-blue-500 text-white text-sm px-3 py-1 rounded-full">
            {user.role}
          </span>
        </div>

        {/* Link Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Create Opportunity Card */}
          <NavLink
            to="/opportunity"
            className="flex items-center justify-center p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all"
          >
            <div className="text-center">
              <FaPlusCircle className="text-4xl mb-4" /> {/* Icon for Create Opportunity */}
              <h2 className="text-2xl font-semibold">Create Opportunity</h2>
              <p className="text-sm opacity-80 mt-2">Add a new opportunity for users.</p>
            </div>
          </NavLink>

          {/* View Opportunities Card */}
          <NavLink
            to="/list"
            className="flex items-center justify-center p-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all"
          >
            <div className="text-center">
              <FaEye className="text-4xl mb-4" /> {/* Icon for View Opportunities */}
              <h2 className="text-2xl font-semibold">View Opportunities</h2>
              <p className="text-sm opacity-80 mt-2">Browse all available opportunities.</p>
            </div>
          </NavLink>

          {/* Manage Users Card */}
          <NavLink
            to="/user-management"
            className="flex items-center justify-center p-6 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all"
          >
            <div className="text-center">
              <FaUserEdit className="text-4xl mb-4" /> {/* Icon for User Management */}
              <h2 className="text-2xl font-semibold">User Management</h2>
              <p className="text-sm opacity-80 mt-2">View, edit, and deactivate users.</p>
            </div>
          </NavLink>

          {/* Platform Analytics Card */}
          <NavLink
            to="/leaderboard"
            className="flex items-center justify-center p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all"
          >
            <div className="text-center">
              <FaChartLine className="text-4xl mb-4" /> {/* Icon for Platform Analytics */}
              <h2 className="text-2xl font-semibold">Platform Analytics</h2>
              <p className="text-sm opacity-80 mt-2">
                View reports and monitor platform activity.
              </p>
            </div>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Admin;
