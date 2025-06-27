import { create } from 'zustand';
import type { Task, TaskFilters, EmployeeSummary, User } from '../types';

interface TaskState {
  tasks: Task[];
  employees: User[];
  employeeSummary: EmployeeSummary[];
  loading: boolean;
  filters: TaskFilters;

  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updatedTask: Partial<Task>) => void;
  removeTask: (taskId: string) => void;
  setEmployees: (employees: User[]) => void;
  setEmployeeSummary: (summary: EmployeeSummary[]) => void;
  setLoading: (loading: boolean) => void;
  setFilters: (filters: Partial<TaskFilters>) => void;
  clearFilters: () => void;

  getFilteredTasks: () => Task[];
  getTaskById: (taskId: string) => Task | undefined;
  getTasksByStatus: (status: Task['status']) => Task[];
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  employees: [],
  employeeSummary: [],
  loading: false,
  filters: {},

  setTasks: (tasks) => set({ tasks }),

  addTask: (task) =>
    set((state) => ({
      tasks: [task, ...state.tasks],
    })),

  updateTask: (taskId, updatedTask) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, ...updatedTask } : task
      ),
    })),

  removeTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
    })),

  setEmployees: (employees) => set({ employees }),

  setEmployeeSummary: (summary) => set({ employeeSummary: summary }),

  setLoading: (loading) => set({ loading }),

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),

  clearFilters: () => set({ filters: {} }),

  getFilteredTasks: () => {
    const { tasks, filters } = get();
    let filteredTasks = [...tasks];

    if (filters.assignedToId) {
      filteredTasks = filteredTasks.filter(
        (task) => task.assignedTo?.id === filters.assignedToId
      );
    }

    if (filters.status) {
      filteredTasks = filteredTasks.filter(
        (task) => task.status === filters.status
      );
    }

    if (filters.sortBy && filters.sortOrder) {
      filteredTasks.sort((a, b) => {
        const aValue = a[filters.sortBy as keyof Task];
        const bValue = b[filters.sortBy as keyof Task];

        if (aValue === undefined || bValue === undefined) return 0;

        const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        return filters.sortOrder === 'asc' ? comparison : -comparison;
      });
    }

    return filteredTasks;
  },

  getTaskById: (taskId) => {
    const { tasks } = get();
    return tasks.find((task) => task.id === taskId);
  },

  getTasksByStatus: (status) => {
    const { tasks } = get();
    return tasks.filter((task) => task.status === status);
  },
}));
