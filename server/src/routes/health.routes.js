// Minimal route file to confirm server/process is alive

import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/', (req, res) => {
    res.json({ status: 'ok' });
});