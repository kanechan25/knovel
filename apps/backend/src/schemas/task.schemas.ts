import { z } from 'zod';

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title must not exceed 200 characters'),
    description: z.string().max(1000, 'Description must not exceed 1000 characters').optional(),
    assignedToId: z.string().uuid('Invalid user ID').optional(),
    dueDate: z.string().datetime('Invalid date format').optional(),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title cannot be empty').max(200, 'Title must not exceed 200 characters').optional(),
    description: z.string().max(1000, 'Description must not exceed 1000 characters').optional(),
    status: z
      .enum(['PENDING', 'IN_PROGRESS', 'COMPLETED'], {
        errorMap: () => ({
          message: 'Status must be PENDING, IN_PROGRESS, or COMPLETED',
        }),
      })
      .optional(),
    assignedToId: z.string().uuid('Invalid user ID').optional(),
    dueDate: z.string().datetime('Invalid date format').optional(),
  }),
});

export const taskParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid task ID'),
  }),
});

export const taskQuerySchema = z.object({
  query: z.object({
    assignedToId: z.string().uuid('Invalid user ID').optional(),
    status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).optional(),
    sortBy: z.enum(['createdAt', 'dueDate', 'status']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  }),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskParamInput = z.infer<typeof taskParamSchema>;
export type TaskQueryInput = z.infer<typeof taskQuerySchema>;
