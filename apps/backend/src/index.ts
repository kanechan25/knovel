import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import logger, { morganStream } from './config/logger';
import { setupRoutes } from './routes';
import { mkdirSync } from 'fs';

const app = express();
app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

// middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
if (env.NODE_ENV !== 'production') {
  app.use(morgan('combined', { stream: morganStream }));
}

// all routes and handlers
setupRoutes(app);

try {
  mkdirSync('logs', { recursive: true });
} catch (error: any) {
  logger.error('Failed to create logs directory:', error.message);
  process.exit(1);
}

app.listen(env.PORT, () => {
  logger.info(`Server running on port ${env.PORT}`);
  logger.info(`Check health API: http://localhost:${env.PORT}/health`);
  logger.info(`Environment: ${env.NODE_ENV}`);
});

export default app;
