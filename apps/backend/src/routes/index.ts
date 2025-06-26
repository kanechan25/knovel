import { Express } from 'express';
import rateLimit from 'express-rate-limit';
import authRoutes from './auth';
import taskRoutes from './tasks';
import { globalErrorHandler, notFoundHandler } from '../middleware/errorHandler';
import logger from '../config/logger';
import { env } from '../config/env';

export const setupRoutes = (app: Express): void => {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, // 100 requests/windowMs/IP
    message: 'Too many requests from this IP, please try again later.',
  });
  app.use(limiter);
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5, // 5 requests/windowMs/IP
    message: 'Too many authentication attempts, please try again later.',
  });

  // Health check endpoint
  app.get('/health', (req, res) => {
    logger.info('Health check requested');
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: env.NODE_ENV,
    });
  });

  app.use('/auth', authLimiter, authRoutes);
  app.use('/tasks', taskRoutes);

  // error handler
  app.use(notFoundHandler);
  app.use(globalErrorHandler);
};
