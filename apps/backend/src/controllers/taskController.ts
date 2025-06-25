import { Response } from 'express';
import { validationResult } from 'express-validator';
import prisma from '../config/database';
import type { AuthRequest } from '../middleware/auth';
import type { TaskStatus } from '../../generated/prisma';

export const createTask = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { title, description, assignedToId, dueDate } = req.body;

    // Validate assignedTo user exists and is an employee
    if (assignedToId) {
      const assignedUser = await prisma.user.findUnique({
        where: { id: assignedToId },
      });

      if (!assignedUser || assignedUser.role !== 'EMPLOYEE') {
        res.status(400).json({ error: 'Invalid employee assignment' });
        return;
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        createdById: req.user!.id,
        assignedToId,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
      include: {
        createdBy: {
          select: { id: true, username: true },
        },
        assignedTo: {
          select: { id: true, username: true },
        },
      },
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTasks = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      assignedToId,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const whereClause: Record<string, unknown> = {};

    // Role-based filtering
    if (req.user!.role === 'EMPLOYEE') {
      // Employees can only see their assigned tasks
      whereClause.assignedToId = req.user!.id;
    } else {
      // Employers can see all tasks they created
      whereClause.createdById = req.user!.id;

      // Apply filters for employers
      if (assignedToId) {
        whereClause.assignedToId = assignedToId as string;
      }
    }

    if (status) {
      whereClause.status = status as TaskStatus;
    }

    const tasks = await prisma.task.findMany({
      where: whereClause,
      include: {
        createdBy: {
          select: { id: true, username: true },
        },
        assignedTo: {
          select: { id: true, username: true },
        },
      },
      orderBy: {
        [sortBy as string]: sortOrder as 'asc' | 'desc',
      },
    });

    res.status(200).json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTaskById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { id: true, username: true },
        },
        assignedTo: {
          select: { id: true, username: true },
        },
      },
    });

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    // Check permissions
    if (req.user!.role === 'EMPLOYEE') {
      if (task.assignedToId !== req.user!.id) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }
    } else if (req.user!.role === 'EMPLOYER') {
      if (task.createdById !== req.user!.id) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }
    }

    res.status(200).json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateTask = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { id } = req.params;
    const { title, description, status, assignedToId, dueDate } = req.body;

    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    // Check permissions
    if (req.user!.role === 'EMPLOYEE') {
      // Employees can only update status of their assigned tasks
      if (task.assignedToId !== req.user!.id) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }
      // Employees can only update status
      if (title || description || assignedToId || dueDate) {
        res
          .status(403)
          .json({ error: 'Employees can only update task status' });
        return;
      }
    } else if (req.user!.role === 'EMPLOYER') {
      if (task.createdById !== req.user!.id) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }
    }

    // Validate assignedTo user if provided
    if (assignedToId) {
      const assignedUser = await prisma.user.findUnique({
        where: { id: assignedToId },
      });

      if (!assignedUser || assignedUser.role !== 'EMPLOYEE') {
        res.status(400).json({ error: 'Invalid employee assignment' });
        return;
      }
    }

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (assignedToId !== undefined) updateData.assignedToId = assignedToId;
    if (dueDate !== undefined)
      updateData.dueDate = dueDate ? new Date(dueDate) : null;

    const updatedTask = await prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        createdBy: {
          select: { id: true, username: true },
        },
        assignedTo: {
          select: { id: true, username: true },
        },
      },
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteTask = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    // Only employers who created the task can delete it
    if (req.user!.role !== 'EMPLOYER' || task.createdById !== req.user!.id) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await prisma.task.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

interface Employee {
  id: string;
  username: string;
  assignedTasks: { status: string }[];
}

export const getEmployeeSummary = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    // Only employers can access this endpoint
    if (req.user!.role !== 'EMPLOYER') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const employees = await prisma.user.findMany({
      where: { role: 'EMPLOYEE' },
      select: {
        id: true,
        username: true,
        assignedTasks: {
          where: {
            createdById: req.user!.id, // Only tasks created by this employer
          },
          select: {
            status: true,
          },
        },
      },
    });

    const summary = employees.map((employee: Employee) => {
      const totalTasks = employee.assignedTasks.length;
      const completedTasks = employee.assignedTasks.filter(
        (task) => task.status === 'COMPLETED'
      ).length;
      const completionRate =
        totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

      return {
        id: employee.id,
        username: employee.username,
        totalTasks,
        completedTasks,
        completionRate: Math.round(completionRate * 100) / 100, // Round to 2 decimal places
      };
    });

    res.status(200).json(summary);
  } catch (error) {
    console.error('Get employee summary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getEmployees = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    // Only employers can access this endpoint
    if (req.user!.role !== 'EMPLOYER') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const employees = await prisma.user.findMany({
      where: { role: 'EMPLOYEE' },
      select: {
        id: true,
        username: true,
        createdAt: true,
      },
    });

    res.status(200).json(employees);
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
