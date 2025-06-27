import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/auth.store';
import { useTaskStore } from '../stores/task.store';
import { taskAPI } from '../services/api';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';
import Navbar from '../components/layout/Navbar';
import Dashboard from '../components/dashboard/Dashboard';

const Home: React.FC = () => {
  const [showSignup, setShowSignup] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const { setTasks, setEmployees, setLoading } = useTaskStore();

  useEffect(() => {
    const loadInitialData = async () => {
      if (!isAuthenticated) return;
      setLoading(true);
      try {
        // Load tasks
        const tasks = await taskAPI.getTasks();
        setTasks(tasks);

        // Load employees if user is an employer
        if (user?.role === 'EMPLOYER') {
          const employees = await taskAPI.getEmployees();
          setEmployees(employees);
        }
      } catch (error) {
        console.error('Failed to load initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [isAuthenticated, user?.role, setTasks, setEmployees, setLoading]);

  const toggleForm = () => setShowSignup(!showSignup);

  if (!isAuthenticated) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
        <div className='w-full max-w-md'>
          {showSignup ? (
            <SignupForm onToggleForm={toggleForm} />
          ) : (
            <LoginForm onToggleForm={toggleForm} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-secondary-50'>
      <Navbar />
      <div className='flex-1'>
        <Dashboard />
      </div>
    </div>
  );
};

export default Home;
