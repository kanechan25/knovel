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
import { validate } from '../middleware/validate';
import { createTaskSchema, updateTaskSchema, taskParamSchema, taskQuerySchema } from '../schemas/task.schemas';

const router = Router();

router.use(authenticateToken);

// get tasks filtered based on roles
router.get('/', validate(taskQuerySchema), getTasks);

router.post('/', requireEmployer, validate(createTaskSchema), createTask);
router.get('/employees', requireEmployer, getEmployees);
router.get('/summary', requireEmployer, getEmployeeSummary);
router.delete('/:id', requireEmployer, validate(taskParamSchema), deleteTask);
router.get('/:id', validate(taskParamSchema), getTaskById);
router.put('/:id', validate(taskParamSchema), validate(updateTaskSchema), updateTask);

export default router;
