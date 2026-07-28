// Define the Express application: global middleware, mounted routes, and error handler

import cors from 'cors';
import express from 'express';

import { config } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { healthRouter } from './routes/health.routes.js';

export const app = express();
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use('/api/health', healthRouter);
app.use(errorHandler);