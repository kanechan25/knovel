import { Request, Response } from 'express';
import authService from '../services/auth.service';
import { asyncHandler } from '../middleware/errorHandler';
import logger from '../config/logger';

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { username, password, role } = req.body;
  const result = await authService.signup({ username, password, role });
  logger.info(`User registered successfully: ${username}`);
  res.status(201).json(result);
});

export const signin = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const result = await authService.signin({ username, password });
  logger.info(`User logged in successfully: ${username}`);
  res.status(200).json(result);
});
