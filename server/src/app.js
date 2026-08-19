// Define the Express application: global middleware, mounted routes, and error handler

import cors from 'cors';
import express from 'express';

import { config } from './config/env.js';
import { healthRouter } from './routes/health.routes.js';
import { categoriesRouter } from './routes/categories.routes.js';
import { photosRouter } from './routes/photos.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

export const app = express();
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use('/api/health', healthRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/photos', photosRouter);
app.use(errorHandler);