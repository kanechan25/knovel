import { Router } from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getEmployeeSummary,
  getEmployees,
} from '../controllers/taskController';
import { authenticateToken, requireEmployer } from '../middleware/auth';
import {
  createTaskValidation,
  updateTaskValidation,
  taskParamValidation,
  taskQueryValidation,
} from '../middleware/validation';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// GET /tasks - Get tasks (filtered based on user role)
router.get('/', taskQueryValidation, getTasks);

// POST /tasks - Create a new task (Employer only)
router.post('/', requireEmployer, createTaskValidation, createTask);

// GET /tasks/employees - Get list of employees (Employer only)
router.get('/employees', requireEmployer, getEmployees);

// GET /tasks/summary - Get employee task summary (Employer only)
router.get('/summary', requireEmployer, getEmployeeSummary);

// GET /tasks/:id - Get a specific task
router.get('/:id', taskParamValidation, getTaskById);

// PUT /tasks/:id - Update a task
router.put('/:id', taskParamValidation, updateTaskValidation, updateTask);

// DELETE /tasks/:id - Delete a task (Employer only)
router.delete('/:id', requireEmployer, taskParamValidation, deleteTask);

export default router;
