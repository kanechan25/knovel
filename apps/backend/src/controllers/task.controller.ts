import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import taskService from '../services/task.service';
import { CreateTaskDto, UpdateTaskDto } from '../types';
import { TaskStatus } from '@prisma/client';

export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const taskData: CreateTaskDto = req.body;
    const user = { id: req.user!.userId, username: req.user!.userId, role: req.user!.role };

    // Convert Date to string for service
    const serviceData = {
      ...taskData,
      dueDate: taskData.dueDate ? taskData.dueDate.toISOString() : undefined
    };

    const task = await taskService.createTask(serviceData, user);
    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, assignedToId, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const user = { id: req.user!.userId, username: req.user!.userId, role: req.user!.role };

    const filters = {
      status: status as TaskStatus,
      assignedToId: assignedToId as string,
      sortBy: sortBy as any,
      sortOrder: sortOrder as 'asc' | 'desc'
    };

    const tasks = await taskService.getTasks(filters, user);
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTaskById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = { id: req.user!.userId, username: req.user!.userId, role: req.user!.role };

    const task = await taskService.getTaskById(id, user);
    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { id } = req.params;
    const updateData: UpdateTaskDto = req.body;
    const user = { id: req.user!.userId, username: req.user!.userId, role: req.user!.role };

    // Convert Date to string for service
    const serviceData = {
      ...updateData,
      dueDate: updateData.dueDate ? updateData.dueDate.toISOString() : undefined
    };

    const task = await taskService.updateTask(id, serviceData, user);
    res.json(task);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = { id: req.user!.userId, username: req.user!.userId, role: req.user!.role };

    await taskService.deleteTask(id, user);
    res.status(204).send();
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getEmployees = async (req: Request, res: Response): Promise<void> => {
  try {
    const employees = await taskService.getEmployees();
    res.json(employees);
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
