import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useTaskStore } from '../../stores/taskStore';
import TaskList from '../tasks/TaskList';
import TaskFormModal from '../tasks/TaskFormModal';
import EmployeeSummary from '../tasks/EmployeeSummary';
import Stats from '../tasks/Stats';

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { tasks } = useTaskStore();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (task) => task.status === 'COMPLETED'
  ).length;
  const inProgressTasks = tasks.filter(
    (task) => task.status === 'IN_PROGRESS'
  ).length;
  const pendingTasks = tasks.filter((task) => task.status === 'PENDING').length;

  return (
    <div className='max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8'>
      <div className='mb-8'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-secondary-900'>
              Welcome back, {user?.username}!
            </h1>
            <p className='text-secondary-600'>
              {user?.role === 'EMPLOYER'
                ? 'Manage your team and track task progress'
                : 'View and update your assigned tasks'}
            </p>
          </div>
          {user?.role === 'EMPLOYER' && (
            <button
              onClick={() => setIsTaskModalOpen(true)}
              className='btn-primary flex items-center space-x-2'
            >
              <span>Create Task</span>
            </button>
          )}
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2 space-y-6'>
          <div className='card'>
            <div className='card-header'>
              <h2 className='text-lg font-medium text-secondary-900'>
                {user?.role === 'EMPLOYER' ? 'All Tasks' : 'My Tasks'}
              </h2>
            </div>
            <div className='card-body p-0'>
              <TaskList />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
          {user?.role === 'EMPLOYER' && (
            <div className='card'>
              <div className='card-header'>
                <h2 className='text-lg font-medium text-secondary-900'>
                  Employee Summary
                </h2>
              </div>
              <div className='card-body'>
                <EmployeeSummary />
              </div>
            </div>
          )}
          <Stats
            totalTasks={totalTasks}
            completedTasks={completedTasks}
            inProgressTasks={inProgressTasks}
            pendingTasks={pendingTasks}
          />
        </div>
      </div>
      <TaskFormModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
