// Query function to retrieve data from the categories table

import { pool } from '../../config/db.js';

export async function getAllCategories() {
    const result = await pool.query('SELECT id, name FROM categories ORDER BY name');
    return result.rows;
}