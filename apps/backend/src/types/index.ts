import type { UserRole, TaskStatus } from '@prisma/client';

export interface AuthUser {
  id: string;
  username: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface SignupData {
  username: string;
  password: string;
  role: UserRole;
}

export interface SigninData {
  username: string;
  password: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  assignedToId?: string;
  dueDate?: string;
}

export interface UpdateTaskData {
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

export interface EmployeeSummary {
  id: string;
  username: string;
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
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

export interface CreateUserDto {
  username: string;
  password: string;
  role: UserRole;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  assignedToId?: string;
  dueDate?: Date;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  assignedToId?: string;
  dueDate?: Date;
}

export { UserRole, TaskStatus };
