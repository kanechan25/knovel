import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import { AuthUser } from '../types';
import { AppError } from './errorHandler';
import logger from '../config/logger';
import type { UserRole } from '../../generated/prisma';

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      throw new AppError('Access token required', 401);
    }

    const user = authService.verifyToken(token);
    req.user = user;

    logger.debug(`User authenticated: ${user.username} (${user.role})`);
    next();
  } catch (error) {
    next(error);
  }
};

export const requireRole = (roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      if (!roles.includes(req.user.role)) {
        logger.warn(`Access denied: ${req.user.username} tried to access ${req.path}`);
        throw new AppError('Insufficient permissions', 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const requireEmployer = requireRole(['EMPLOYER' as UserRole]);
export const requireEmployee = requireRole(['EMPLOYEE' as UserRole]);
export const requireAnyRole = requireRole(['EMPLOYER' as UserRole, 'EMPLOYEE' as UserRole]);
