import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import prisma from '../config/database';
import type { UserRole } from '@prisma/client';
import { AppError } from './errorHandler';
import logger from '../config/logger';

interface JwtPayload {
  userId: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: UserRole;
      };
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Access token required' });
    return;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    
    // Verify user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    req.user = {
      userId: decoded.userId,
      role: decoded.role
    };
    
    logger.debug(`User authenticated: ${user.username} (${user.role})`);
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

export const requireRole = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Insufficient permissions' });
      return;
    }

    next();
  };
};

export const requireEmployer = requireRole(['EMPLOYER']);
export const requireEmployee = requireRole(['EMPLOYEE']);
export const requireAnyRole = requireRole(['EMPLOYER', 'EMPLOYEE']);
