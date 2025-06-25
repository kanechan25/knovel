import type { UserRole, TaskStatus } from '../../generated/prisma';

export interface AuthUser {
  id: string;
  username: string;
  role: UserRole;
}

export interface SignupRequest {
  username: string;
  password: string;
  role: UserRole;
}

export interface SigninRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    role: UserRole;
  };
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  assignedToId?: string;
  dueDate?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  assignedToId?: string;
  dueDate?: string;
}

export interface TaskFilters {
  assignedToId?: string;
  status?: TaskStatus;
  sortBy?: 'createdAt' | 'dueDate' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export interface TaskResponse {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    username: string;
  };
  assignedTo?: {
    id: string;
    username: string;
  };
}

export interface EmployeeSummary {
  id: string;
  username: string;
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
}
