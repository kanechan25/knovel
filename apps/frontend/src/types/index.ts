export interface User {
  id: string;
  username: string;
  role: 'EMPLOYER' | 'EMPLOYEE';
  createdAt?: string;
}

export interface FormProps {
  onToggleForm: () => void;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface SignupRequest {
  username: string;
  password: string;
  role: 'EMPLOYER' | 'EMPLOYEE';
}

export interface SigninRequest {
  username: string;
  password: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
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

export interface CreateTaskRequest {
  title: string;
  description?: string;
  assignedToId?: string;
  dueDate?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  assignedToId?: string;
  dueDate?: string;
}

export interface TaskFilters {
  assignedToId?: string;
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
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

export interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  completionRate: number;
}

export interface SummaryData {
  employeeSummary: EmployeeSummary[];
  taskStats: TaskStats;
  totalEmployees: number;
}

export interface ApiError {
  error: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}
export interface PasswordInputProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  minLength?: number;
  className?: string;
  label?: string;
}
