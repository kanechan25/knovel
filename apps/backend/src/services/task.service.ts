import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import logger from '../config/logger';
import type { AuthUser, CreateTaskData, UpdateTaskData, TaskFilters } from '../types';

class TaskService {
  async createTask(data: CreateTaskData, createdBy: AuthUser) {
    logger.info(`Creating task: ${data.title} by ${createdBy.username}`);

    // Check user exists + is an employee
    if (data.assignedToId) {
      const assignedUser = await prisma.user.findUnique({
        where: { id: data.assignedToId },
      });
      if (!assignedUser || assignedUser.role !== 'EMPLOYEE') {
        logger.warn(`Invalid employee assignment: ${data.assignedToId}`);
        throw new AppError('Invalid employee assignment', 400);
      }
    }

    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        createdById: createdBy.id,
        assignedToId: data.assignedToId,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
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
    logger.info(`Task created successfully: ${task.id}`);
    return task;
  }

  async getTasks(filters: TaskFilters, user: AuthUser) {
    logger.debug(`Getting tasks for ${user.username} (${user.role})`);

    const whereClause: Record<string, unknown> = {};

    // filter by role
    if (user.role === 'EMPLOYEE') {
      whereClause.assignedToId = user.id;
    } else {
      whereClause.createdById = user.id;
      if (filters.assignedToId) {
        whereClause.assignedToId = filters.assignedToId;
      }
    }
    if (filters.status) {
      whereClause.status = filters.status;
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
        [filters.sortBy || 'createdAt']: filters.sortOrder || 'desc',
      },
    });
    logger.debug(`Found ${tasks.length} tasks for ${user.username}`);
    return tasks;
  }

  async getTaskById(id: string, user: AuthUser) {
    logger.debug(`Getting task ${id} for ${user.username}`);
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
      throw new AppError('Task not found', 404);
    }
    if (user.role === 'EMPLOYEE') {
      if (task.assignedToId !== user.id) {
        logger.warn(`Access denied: Employee ${user.id} accessing task ${id}`);
        throw new AppError('Access denied', 403);
      }
    } else if (user.role === 'EMPLOYER') {
      if (task.createdById !== user.id) {
        logger.warn(`Access denied: Employer ${user.id} accessing task ${id}`);
        throw new AppError('Access denied', 403);
      }
    }
    return task;
  }

  async updateTask(id: string, data: UpdateTaskData, user: AuthUser) {
    logger.info(`Updating task ${id} by ${user.username}`);

    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    // Check role permissions
    if (user.role === 'EMPLOYEE') {
      if (task.assignedToId !== user.id) {
        throw new AppError('Access denied', 403);
      }
      if (data.title || data.description || data.assignedToId || data.dueDate) {
        throw new AppError('Employees can only update task status', 403);
      }
    } else if (user.role === 'EMPLOYER') {
      if (task.createdById !== user.id) {
        throw new AppError('Access denied', 403);
      }
    }

    if (data.assignedToId) {
      const assignedUser = await prisma.user.findUnique({
        where: { id: data.assignedToId },
      });

      if (!assignedUser || assignedUser.role !== 'EMPLOYEE') {
        throw new AppError('Invalid employee assignment', 400);
      }
    }
    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.assignedToId !== undefined) updateData.assignedToId = data.assignedToId;
    if (data.dueDate !== undefined) {
      updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    }
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
    logger.info(`Task ${id} updated successfully`);
    return updatedTask;
  }

  async deleteTask(id: string, user: AuthUser) {
    logger.info(`Deleting task ${id} by ${user.username}`);
    const task = await prisma.task.findUnique({
      where: { id },
    });
    if (!task) {
      throw new AppError('Task not found', 404);
    }

    // check delete permission
    if (user.role !== 'EMPLOYER' || task.createdById !== user.id) {
      throw new AppError('Access denied', 403);
    }
    await prisma.task.delete({
      where: { id },
    });
    logger.info(`Task ${id} deleted successfully`);
  }

  async getEmployees() {
    logger.debug('Getting all employees');
    const employees = await prisma.user.findMany({
      where: { role: 'EMPLOYEE' },
      select: {
        id: true,
        username: true,
        createdAt: true,
      },
    });
    return employees;
  }
}

export default new TaskService();
