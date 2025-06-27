import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useTaskStore } from '../../stores/taskStore';
import { taskAPI } from '../../services/api';
import type { CreateTaskRequest } from '../../types';
import dayjs from 'dayjs';

interface TaskFormProps {
  onSuccess?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSuccess }) => {
  const { employees, addTask } = useTaskStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateTaskRequest>({
    title: '',
    description: '',
    assignedToId: '',
    dueDate: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const taskData: CreateTaskRequest = {
        title: formData.title,
        description: formData.description || undefined,
        assignedToId: formData.assignedToId || undefined,
        dueDate: formData.dueDate || undefined,
      };
      const newTask = await taskAPI.createTask(taskData);
      addTask(newTask);
      setFormData({
        title: '',
        description: '',
        assignedToId: '',
        dueDate: '',
      });
      toast.success('Task created successfully!');
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const minDate = dayjs().format('YYYY-MM-DD');

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div>
        <label htmlFor='title' className='form-label'>
          Task Title *
        </label>
        <input
          id='title'
          name='title'
          type='text'
          required
          value={formData.title}
          onChange={handleChange}
          className='form-input'
          placeholder='Enter task title'
          disabled={loading}
          maxLength={200}
        />
        <p className='text-xs text-secondary-500 mt-1'>
          {formData.title.length}/200 characters
        </p>
      </div>

      <div>
        <label htmlFor='description' className='form-label'>
          Description
        </label>
        <textarea
          id='description'
          name='description'
          value={formData.description}
          onChange={handleChange}
          className='form-input'
          placeholder='Enter task description (optional)'
          disabled={loading}
          rows={4}
          maxLength={1000}
        />
        <p className='text-xs text-secondary-500 mt-1'>
          {(formData.description || '').length}/1000 characters
        </p>
      </div>

      {/* Assign to Employee */}
      <div>
        <label htmlFor='assignedToId' className='form-label'>
          Assign to Employee
        </label>
        <select
          id='assignedToId'
          name='assignedToId'
          value={formData.assignedToId}
          onChange={handleChange}
          className='form-input'
          disabled={loading}
        >
          <option value=''>Select an employee (optional)</option>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.username}
            </option>
          ))}
        </select>
        <p className='text-xs text-secondary-500 mt-1'>
          Leave unassigned if you want to assign it later
        </p>
      </div>

      <div>
        <label htmlFor='dueDate' className='form-label'>
          Due Date
        </label>
        <input
          id='dueDate'
          name='dueDate'
          type='date'
          value={formData.dueDate}
          onChange={handleChange}
          className='form-input'
          disabled={loading}
          min={minDate}
        />
        <p className='text-xs text-secondary-500 mt-1'>
          Optional: Set a due date for this task
        </p>
      </div>

      {/* Submit Button */}
      <div className='flex justify-end'>
        <button
          type='submit'
          disabled={loading || !formData.title.trim()}
          className='btn-primary'
        >
          {loading ? (
            <div className='flex items-center'>
              <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
              Creating Task...
            </div>
          ) : (
            'Create Task'
          )}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
