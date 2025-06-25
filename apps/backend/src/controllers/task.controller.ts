import { Response } from 'express';
import taskService from '../services/task.service';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const createTask = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title, description, assignedToId, dueDate } = req.body;

  const task = await taskService.createTask({ title, description, assignedToId, dueDate }, req.user!);

  res.status(201).json(task);
});

export const getTasks = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { assignedToId, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

  const tasks = await taskService.getTasks(
    {
      assignedToId: assignedToId as string,
      status: status as any,
      sortBy: sortBy as any,
      sortOrder: sortOrder as any,
    },
    req.user!
  );

  res.status(200).json(tasks);
});

export const getTaskById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const task = await taskService.getTaskById(id, req.user!);

  res.status(200).json(task);
});

export const updateTask = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { title, description, status, assignedToId, dueDate } = req.body;

  const updatedTask = await taskService.updateTask(
    id,
    { title, description, status, assignedToId, dueDate },
    req.user!
  );

  res.status(200).json(updatedTask);
});

export const deleteTask = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  await taskService.deleteTask(id, req.user!);

  res.status(204).send();
});

export const getEmployeeSummary = asyncHandler(async (req: AuthRequest, res: Response) => {
  const summary = await taskService.getEmployeeSummary(req.user!.id);

  res.status(200).json(summary);
});

export const getEmployees = asyncHandler(async (req: AuthRequest, res: Response) => {
  const employees = await taskService.getEmployees();

  res.status(200).json(employees);
});
