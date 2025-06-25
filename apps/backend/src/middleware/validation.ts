import { body, param, query } from 'express-validator';

export const signupValidation = [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .isIn(['EMPLOYER', 'EMPLOYEE'])
    .withMessage('Role must be either EMPLOYER or EMPLOYEE'),
];

export const signinValidation = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const createTaskValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title must not exceed 200 characters'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  body('assignedToId')
    .optional()
    .isString()
    .withMessage('Assigned user ID must be a string'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),
];

export const updateTaskValidation = [
  body('title')
    .optional()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Title must not exceed 200 characters'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  body('status')
    .optional()
    .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED'])
    .withMessage('Status must be PENDING, IN_PROGRESS, or COMPLETED'),
  body('assignedToId')
    .optional()
    .isString()
    .withMessage('Assigned user ID must be a string'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),
];

export const taskParamValidation = [
  param('id').notEmpty().withMessage('Task ID is required'),
];

export const taskQueryValidation = [
  query('assignedToId')
    .optional()
    .isString()
    .withMessage('Assigned user ID must be a string'),
  query('status')
    .optional()
    .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED'])
    .withMessage('Status must be PENDING, IN_PROGRESS, or COMPLETED'),
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'dueDate', 'status'])
    .withMessage('Sort by must be createdAt, dueDate, or status'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
];
