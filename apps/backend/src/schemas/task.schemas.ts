import { z } from 'zod';

const cuidRegex = /^c[a-z0-9]{24}$/;
const cuid = () => z.string().regex(cuidRegex, 'Invalid ID format');

const dateString = () =>
  z.string().refine((date) => {
    // Accept YYYY-MM-DD format and validate it's a valid date
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) return false;

    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  }, 'Invalid date format (expected YYYY-MM-DD)');

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title must not exceed 200 characters'),
    description: z.string().max(1000, 'Description must not exceed 1000 characters').optional(),
    assignedToId: cuid().optional(),
    dueDate: dateString().optional(),
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
    assignedToId: cuid().optional(),
    dueDate: dateString().optional(),
  }),
});

export const taskParamSchema = z.object({
  params: z.object({
    id: cuid(),
  }),
});

export const taskQuerySchema = z.object({
  query: z.object({
    assignedToId: cuid().optional(),
    status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).optional(),
    sortBy: z.enum(['createdAt', 'dueDate', 'status']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  }),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskParamInput = z.infer<typeof taskParamSchema>;
export type TaskQueryInput = z.infer<typeof taskQuerySchema>;
