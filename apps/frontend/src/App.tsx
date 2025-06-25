import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useAuthStore } from "./stores/authStore";
import { useTaskStore } from "./stores/taskStore";
import { taskAPI } from "./services/api";

// Components
import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";
import Navbar from "./components/layout/Navbar";
import Dashboard from "./components/dashboard/Dashboard";

const App: React.FC = () => {
  const [showSignup, setShowSignup] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const { setTasks, setEmployees, setEmployeeSummary, setLoading } =
    useTaskStore();

  // Load initial data when authenticated
  useEffect(() => {
    const loadInitialData = async () => {
      if (!isAuthenticated) return;

      setLoading(true);
      try {
        // Load tasks
        const tasks = await taskAPI.getTasks();
        setTasks(tasks);

        // Load employees if user is an employer
        if (user?.role === "EMPLOYER") {
          const [employees, summary] = await Promise.all([
            taskAPI.getEmployees(),
            taskAPI.getEmployeeSummary(),
          ]);
          setEmployees(employees);
          setEmployeeSummary(summary);
        }
      } catch (error) {
        console.error("Failed to load initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [
    isAuthenticated,
    user?.role,
    setTasks,
    setEmployees,
    setEmployeeSummary,
    setLoading,
  ]);

  const toggleForm = () => setShowSignup(!showSignup);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {showSignup ? (
            <SignupForm onToggleForm={toggleForm} />
          ) : (
            <LoginForm onToggleForm={toggleForm} />
          )}
        </div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <Navbar />
      <main className="flex-1">
        <Dashboard />
      </main>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default App;
