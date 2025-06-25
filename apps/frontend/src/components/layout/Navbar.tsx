import React from "react";
import { useAuthStore } from "../../stores/authStore";
import { authAPI } from "../../services/api";

const Navbar: React.FC = () => {
  const { user, clearAuth } = useAuthStore();

  const handleLogout = () => {
    authAPI.signout();
    clearAuth();
  };

  return (
    <nav className="bg-white shadow-sm border-b border-secondary-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-primary-600">
                Task Manager
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="text-sm">
                <p className="font-medium text-secondary-900">
                  {user?.username}
                </p>
                <p className="text-secondary-500 capitalize">
                  {user?.role.toLowerCase()}
                </p>
              </div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                  user?.role === "EMPLOYER" ? "bg-primary-600" : "bg-green-600"
                }`}
              >
                {user?.username.charAt(0).toUpperCase()}
              </div>
            </div>

            <button onClick={handleLogout} className="btn-secondary">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
