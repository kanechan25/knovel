import { Request, Response } from 'express';
import authService from '../services/auth.service';
import { asyncHandler } from '../middleware/errorHandler';
import logger from '../config/logger';
import { env } from '../config/env';

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  maxAge: 48 * 60 * 60 * 1000, // 48 hours
};

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { username, password, role } = req.body;
  const { token, user } = await authService.signup({ username, password, role });
  logger.info(`User registered successfully: ${username}`);
  res.cookie('accessToken', token, cookieOptions);
  res.status(201).json({ user });
});

export const signin = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const { token, user } = await authService.signin({ username, password });
  logger.info(`User logged in successfully: ${username}`);
  res.cookie('accessToken', token, cookieOptions);
  res.status(200).json({ user });
});

export const signout = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });
  res.status(200).json({ message: 'Signed out successfully' });
});
