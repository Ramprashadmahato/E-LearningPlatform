import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import NotificationManage from "./NotificationManage";

function NavBar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Hide the entire navbar if the user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <nav className="p-4 bg-slate-100 border-b border-gray-300 text-black shadow-md">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        {/* Left Side - Navigation Links */}
        <div className="flex space-x-6">
          <NavLink to="/" className="hover:text-green-500 font-medium gap-4">
            Home
          </NavLink>

          {user.role === "Admin" && (
            <NavLink to="/dashboard/admin" className="hover:text-green-500 font-medium gap-4">
              Admin
            </NavLink>
          )}

          {user.role === "Recruiter" && (
            <NavLink to="/dashboard/recruiter" className="hover:text-green-500 font-medium gap-4">
              Recruiter
            </NavLink>
          )}

          {user.role === "Participant" && (
            <>
              <NavLink to="/dashboard/participant" className="hover:text-green-500 font-medium gap-4">
                Participant
              </NavLink>
              <NavLink to="/notifications" className="hover:text-green-500 font-medium flex items-center gap-4">
                <NotificationManage />
              </NavLink>
              <NavLink to="/displayScore" className="hover:text-green-500 font-medium gap-4">
                Quiz Score
              </NavLink>
            </>
          )}
        </div>

        {/* Right Side - Profile & Logout */}
        <div className="flex items-center space-x-6">
          <NavLink to="/profile" className="hover:text-green-500 font-medium gap-4">
            Profile
          </NavLink>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 gap-4"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
