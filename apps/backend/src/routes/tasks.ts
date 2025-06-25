import { Router } from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getEmployeeSummary,
  getEmployees,
} from '../controllers/task.controller';
import { authenticateToken, requireEmployer } from '../middleware/auth';
import { validateSchema } from '../middleware/validateSchema';
import { createTaskSchema, updateTaskSchema, taskParamSchema, taskQuerySchema } from '../schemas/task.schemas';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// GET /tasks - Get tasks (filtered based on user role)
router.get('/', validateSchema(taskQuerySchema), getTasks);

// POST /tasks - Create a new task (Employer only)
router.post('/', requireEmployer, validateSchema(createTaskSchema), createTask);

// GET /tasks/employees - Get list of employees (Employer only)
router.get('/employees', requireEmployer, getEmployees);

// GET /tasks/summary - Get employee task summary (Employer only)
router.get('/summary', requireEmployer, getEmployeeSummary);

// GET /tasks/:id - Get a specific task
router.get('/:id', validateSchema(taskParamSchema), getTaskById);

// PUT /tasks/:id - Update a task
router.put('/:id', validateSchema(taskParamSchema), validateSchema(updateTaskSchema), updateTask);

// DELETE /tasks/:id - Delete a task (Employer only)
router.delete('/:id', requireEmployer, validateSchema(taskParamSchema), deleteTask);

export default router;
