import type { Task } from '../types';

export const getStatusBadgeClass = (status: Task['status']) => {
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

export const getStatusDisplayName = (status: Task['status']) => {
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
