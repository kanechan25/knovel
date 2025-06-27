import React from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useTaskStore } from '../../stores/taskStore';
import TaskList from '../tasks/TaskList';
import TaskForm from '../tasks/TaskForm';
import EmployeeSummary from '../tasks/EmployeeSummary';

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { tasks } = useTaskStore();

  // Calculate statistics
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
        <h1 className='text-2xl font-bold text-secondary-900'>
          Welcome back, {user?.username}!
        </h1>
        <p className='text-secondary-600'>
          {user?.role === 'EMPLOYER'
            ? 'Manage your team and track task progress'
            : 'View and update your assigned tasks'}
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Main Content */}
        <div className='lg:col-span-2 space-y-6'>
          {user?.role === 'EMPLOYER' && (
            <div className='card'>
              <div className='card-header'>
                <h2 className='text-lg font-medium text-secondary-900'>
                  Create New Task
                </h2>
              </div>
              <div className='card-body'>
                <TaskForm />
              </div>
            </div>
          )}

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

          {/* Quick Stats */}
          <div className='card'>
            <div className='card-header'>
              <h2 className='text-lg font-medium text-secondary-900'>
                Quick Stats
              </h2>
            </div>
            <div className='card-body'>
              <div className='space-y-3'>
                <div className='flex justify-between'>
                  <span className='text-secondary-600'>Total Tasks:</span>
                  <span className='font-semibold'>{totalTasks}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-secondary-600'>Completed:</span>
                  <span className='font-semibold text-green-600'>
                    {completedTasks}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-secondary-600'>In Progress:</span>
                  <span className='font-semibold text-blue-600'>
                    {inProgressTasks}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-secondary-600'>Pending:</span>
                  <span className='font-semibold text-yellow-600'>
                    {pendingTasks}
                  </span>
                </div>
                {totalTasks > 0 && (
                  <div className='mt-4 pt-3 border-t border-secondary-200'>
                    <div className='flex justify-between'>
                      <span className='text-secondary-600'>
                        Completion Rate:
                      </span>
                      <span className='font-semibold text-primary-600'>
                        {Math.round((completedTasks / totalTasks) * 100)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
