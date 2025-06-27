import React from 'react';
import TaskForm from './TaskForm';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'
      onClick={handleBackdropClick}
    >
      <div className='bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
        <div className='flex items-center justify-between p-6 border-b border-secondary-200'>
          <h2 className='text-xl font-semibold text-secondary-900'>
            Create New Task
          </h2>
          <button
            onClick={onClose}
            className='text-secondary-400 hover:text-secondary-600 transition-colors'
          >
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>

        <div className='p-6'>
          <TaskForm onSuccess={onClose} />
        </div>
      </div>
    </div>
  );
};

export default TaskFormModal;
