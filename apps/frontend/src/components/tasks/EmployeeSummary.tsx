import React from 'react';
import { useTaskStore } from '../../stores/taskStore';

const EmployeeSummary: React.FC = () => {
  const { employeeSummary, loading } = useTaskStore();

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

  const getCompletionRateColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 60) return 'text-blue-600';
    if (rate >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCompletionRateBackground = (rate: number) => {
    if (rate >= 80) return 'bg-green-100';
    if (rate >= 60) return 'bg-blue-100';
    if (rate >= 40) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className='space-y-4'>
      <div className='text-sm text-secondary-600 mb-4'>
        Task completion statistics for all employees
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

          {/* Progress Bar */}
          <div className='mt-3'>
            <div className='w-full bg-secondary-200 rounded-full h-2'>
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  employee.completionRate >= 80
                    ? 'bg-green-500'
                    : employee.completionRate >= 60
                      ? 'bg-blue-500'
                      : employee.completionRate >= 40
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(employee.completionRate, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      ))}

      {/* Summary Statistics */}
      <div className='mt-6 p-4 bg-secondary-50 rounded-lg'>
        <h5 className='font-medium text-secondary-900 mb-3'>Team Overview</h5>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
          <div className='text-center'>
            <div className='font-semibold text-lg text-secondary-900'>
              {employeeSummary.length}
            </div>
            <div className='text-secondary-500'>Total Employees</div>
          </div>
          <div className='text-center'>
            <div className='font-semibold text-lg text-blue-600'>
              {employeeSummary.reduce((sum, emp) => sum + emp.totalTasks, 0)}
            </div>
            <div className='text-secondary-500'>Total Tasks</div>
          </div>
          <div className='text-center'>
            <div className='font-semibold text-lg text-green-600'>
              {employeeSummary.reduce(
                (sum, emp) => sum + emp.completedTasks,
                0
              )}
            </div>
            <div className='text-secondary-500'>Completed Tasks</div>
          </div>
          <div className='text-center'>
            <div className='font-semibold text-lg text-primary-600'>
              {employeeSummary.length > 0
                ? (
                    employeeSummary.reduce(
                      (sum, emp) => sum + emp.completionRate,
                      0
                    ) / employeeSummary.length
                  ).toFixed(1)
                : 0}
              %
            </div>
            <div className='text-secondary-500'>Avg. Completion</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSummary;
