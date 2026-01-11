import express from 'express';
import compression from 'compression';
import morgan from 'morgan';

import { helmetMiddleware, corsMiddleware } from './middleware/security';
import { rateLimiter } from './middleware/rateLimiter';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import routes from './routes';
import { env } from './config/env';

const app = express();

// Security middleware
app.use(helmetMiddleware);
app.use(corsMiddleware);

// Rate limiting
app.use(rateLimiter);

// Compression
app.use(compression());

// Request logging
if (env.NODE_ENV !== 'test') {
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// Body parsing (minimal since this is a GET-only server)
app.use(express.json({ limit: '1kb' }));

// API routes
app.use('/api', routes);

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

export default app;
