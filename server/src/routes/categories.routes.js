// GET /api/categories - lists the fixed category rows for the filter UI

import express from 'express';

import { getAllCategories } from '../db/queries/categories.queries.js';
import { authenticate } from '../middleware/authenticate.js';

export const categoriesRouter = express.Router();

categoriesRouter.get('/', authenticate, async (req, res, next) => {
    try {
        const categories = await getAllCategories();
        res.json({ categories });
    } catch (err) {
        next(err)
    }
});