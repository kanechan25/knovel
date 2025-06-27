import React from 'react';
import { useTaskStore } from '../../stores/task.store';
import { useSummary } from '../../hooks/useSummary';
import {
  getCompletionRateBackground,
  getCompletionRateColor,
  getProgressRateBackground,
} from '../../utils/getColors';

const EmployeeSummary: React.FC = () => {
  const { loading } = useTaskStore();
  const { employeeSummary, taskStats, totalEmployees } = useSummary();

  if (loading) {
    return (
      <div className='flex justify-center items-center py-8'>
        <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600'></div>
        <span className='ml-2 text-secondary-600'>Loading summary...</span>
      </div>
    );
  }

  if (employeeSummary.length === 0) {
    return (
      <div className='text-center py-8'>
        <p className='text-secondary-500'>No employee data available</p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='text-sm text-secondary-600 mb-4'>
        Task completion statistics for all employees
      </div>
      {/* Summary */}
      <div className='mt-6 p-4 bg-secondary-50 rounded-lg'>
        <h5 className='font-medium text-secondary-900 mb-3'>Team Overview</h5>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-4 text-sm'>
          <div className='text-center'>
            <div className='font-semibold text-lg text-secondary-900'>
              {totalEmployees}
            </div>
            <div className='text-secondary-500'>Total Employees</div>
          </div>
          <div className='text-center'>
            <div className='font-semibold text-lg text-blue-600'>
              {taskStats.total}
            </div>
            <div className='text-secondary-500'>Total Tasks Assigned</div>
          </div>
          <div className='text-center'>
            <div className='font-semibold text-lg text-primary-600'>
              {taskStats.completionRate}%
            </div>
            <div className='text-secondary-500'>Avg. Completion</div>
          </div>
          <div className='text-center'>
            <div className='font-semibold text-lg text-green-600'>
              {taskStats.completed}
            </div>
            <div className='text-secondary-500'>Total Completed Tasks</div>
          </div>
          <div className='text-center'>
            <div className='font-semibold text-lg text-blue-600'>
              {taskStats.inProgress}
            </div>
            <div className='text-secondary-500'>Total In Progress Tasks</div>
          </div>
          <div className='text-center'>
            <div className='font-semibold text-lg text-yellow-600'>
              {taskStats.pending}
            </div>
            <div className='text-secondary-500'>Total Pending Tasks</div>
          </div>
        </div>
      </div>
      {employeeSummary.map((employee) => (
        <div
          key={employee.id}
          className='border border-secondary-200 rounded-lg p-4 hover:bg-secondary-50 transition-colors'
        >
          <div className='flex items-center justify-between mb-3'>
            <div className='flex items-center space-x-3'>
              <div className='w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-medium'>
                {employee.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className='font-medium text-secondary-900'>
                  {employee.username}
                </h4>
                <p className='text-xs text-secondary-500'>Employee</p>
              </div>
            </div>
            <div
              className={`px-2 py-1 rounded-full text-xs font-medium ${getCompletionRateBackground(employee.completionRate)} ${getCompletionRateColor(employee.completionRate)}`}
            >
              {employee.completionRate}% Complete
            </div>
          </div>

          <div className='grid grid-cols-3 gap-4 text-sm'>
            <div className='text-center'>
              <div className='font-semibold text-lg text-secondary-900'>
                {employee.totalTasks}
              </div>
              <div className='text-secondary-500'>Total Tasks</div>
            </div>
            <div className='text-center'>
              <div className='font-semibold text-lg text-green-600'>
                {employee.completedTasks}
              </div>
              <div className='text-secondary-500'>Completed</div>
            </div>
            <div className='text-center'>
              <div className='font-semibold text-lg text-blue-600'>
                {employee.totalTasks - employee.completedTasks}
              </div>
              <div className='text-secondary-500'>Remaining</div>
            </div>
          </div>
          <div className='mt-3'>
            <div className='w-full bg-secondary-200 rounded-full h-2'>
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getProgressRateBackground(employee.completionRate)}`}
                style={{ width: `${Math.min(employee.completionRate, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmployeeSummary;
