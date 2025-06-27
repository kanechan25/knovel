import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../stores/authStore';
import { useTaskStore } from '../../stores/taskStore';
import { taskAPI } from '../../services/api';
import type { Task } from '../../types';
import dayjs from 'dayjs';

const TaskList: React.FC = () => {
  const { user } = useAuthStore();
  const {
    tasks,
    employees,
    loading,
    setTasks,
    setLoading,
    updateTask,
    removeTask,
    filters,
    setFilters,
  } = useTaskStore();

  const [statusUpdateLoading, setStatusUpdateLoading] = useState<string | null>(
    null
  );

  const loadTasks = async () => {
    setLoading(true);
    try {
      const tasksData = await taskAPI.getTasks(filters);
      setTasks(tasksData);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [filters]);

  const handleStatusUpdate = async (taskId: string, status: Task['status']) => {
    setStatusUpdateLoading(taskId);
    try {
      const updatedTask = await taskAPI.updateTask(taskId, { status });
      updateTask(taskId, updatedTask);
      toast.success('Task status updated successfully');
    } catch (error) {
      console.error('Failed to update task status:', error);
    } finally {
      setStatusUpdateLoading(null);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await taskAPI.deleteTask(taskId);
      removeTask(taskId);
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const getStatusBadgeClass = (status: Task['status']) => {
    switch (status) {
      case 'PENDING':
        return 'badge-pending';
      case 'IN_PROGRESS':
        return 'badge-in-progress';
      case 'COMPLETED':
        return 'badge-completed';
      default:
        return 'badge-pending';
    }
  };

  const getStatusDisplayName = (status: Task['status']) => {
    switch (status) {
      case 'PENDING':
        return 'Pending';
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'COMPLETED':
        return 'Completed';
      default:
        return 'Pending';
    }
  };

  const canUpdateStatus = (task: Task) => {
    if (user?.role === 'EMPLOYEE') {
      return task.assignedTo?.id === user.id;
    }
    return false;
  };

  const canDelete = (task: Task) => {
    return user?.role === 'EMPLOYER' && task.createdBy.id === user.id;
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center py-8'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600'></div>
        <span className='ml-2 text-secondary-600'>Loading tasks...</span>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {/* Filters and Sorting - Only for Employers */}
      {user?.role === 'EMPLOYER' && (
        <div className='bg-white p-4 rounded-lg border border-secondary-200'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            {/* Filter by Employee */}
            <div>
              <label className='form-label'>Filter by Employee</label>
              <select
                value={filters.assignedToId || ''}
                onChange={(e) =>
                  setFilters({ assignedToId: e.target.value || undefined })
                }
                className='form-input'
              >
                <option value=''>All Employees</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.username}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Status */}
            <div>
              <label className='form-label'>Filter by Status</label>
              <select
                value={filters.status || ''}
                onChange={(e) =>
                  setFilters({
                    status: (e.target.value as Task['status']) || undefined,
                  })
                }
                className='form-input'
              >
                <option value=''>All Statuses</option>
                <option value='PENDING'>Pending</option>
                <option value='IN_PROGRESS'>In Progress</option>
                <option value='COMPLETED'>Completed</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className='form-label'>Sort By</label>
              <select
                value={filters.sortBy || 'createdAt'}
                onChange={(e) =>
                  setFilters({
                    sortBy: e.target.value as
                      | 'createdAt'
                      | 'dueDate'
                      | 'status',
                  })
                }
                className='form-input'
              >
                <option value='createdAt'>Created Date</option>
                <option value='dueDate'>Due Date</option>
                <option value='status'>Status</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className='form-label'>Sort Order</label>
              <select
                value={filters.sortOrder || 'desc'}
                onChange={(e) =>
                  setFilters({ sortOrder: e.target.value as 'asc' | 'desc' })
                }
                className='form-input'
              >
                <option value='desc'>Newest First</option>
                <option value='asc'>Oldest First</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <div className='text-center py-8'>
          <p className='text-secondary-500'>
            {user?.role === 'EMPLOYER'
              ? 'No tasks created yet'
              : 'No tasks assigned to you yet'}
          </p>
        </div>
      ) : (
        <div className='space-y-4'>
          {tasks.map((task) => (
            <div
              key={task.id}
              className='bg-white border border-secondary-200 rounded-lg p-6'
            >
              <div className='flex items-start justify-between'>
                <div className='flex-1'>
                  <div className='flex items-center space-x-3 mb-2'>
                    <h3 className='text-lg font-medium text-secondary-900'>
                      {task.title}
                    </h3>
                    <span
                      className={`badge ${getStatusBadgeClass(task.status)}`}
                    >
                      {getStatusDisplayName(task.status)}
                    </span>
                  </div>

                  {task.description && (
                    <p className='text-secondary-600 mb-3'>
                      {task.description}
                    </p>
                  )}

                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-secondary-500'>
                    <div>
                      <span className='font-medium'>Created by:</span>{' '}
                      {task.createdBy.username}
                    </div>
                    <div>
                      <span className='font-medium'>Assigned to:</span>{' '}
                      {task.assignedTo?.username || 'Unassigned'}
                    </div>
                    <div>
                      <span className='font-medium'>Created:</span>{' '}
                      {dayjs(task.createdAt).format('MMM D, YYYY')}
                    </div>
                    <div>
                      <span className='font-medium'>Due:</span>{' '}
                      {task.dueDate
                        ? dayjs(task.dueDate).format('MMM D, YYYY')
                        : 'No due date'}
                    </div>
                  </div>
                </div>

                <div className='ml-4 flex items-center space-x-2'>
                  {/* Status Update (for assigned employees) */}
                  {canUpdateStatus(task) && (
                    <div className='flex items-center space-x-2'>
                      <label className='text-sm font-medium text-secondary-700'>
                        Update Status:
                      </label>
                      <select
                        value={task.status}
                        onChange={(e) =>
                          handleStatusUpdate(
                            task.id,
                            e.target.value as Task['status']
                          )
                        }
                        disabled={statusUpdateLoading === task.id}
                        className='form-input text-sm'
                      >
                        <option value='PENDING'>Pending</option>
                        <option value='IN_PROGRESS'>In Progress</option>
                        <option value='COMPLETED'>Completed</option>
                      </select>
                      {statusUpdateLoading === task.id && (
                        <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600'></div>
                      )}
                    </div>
                  )}

                  {/* Delete button (for task creators) */}
                  {canDelete(task) && (
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className='btn-danger text-sm'
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
