// Query functions to retrieve and delete data from the photos table

import { pool } from '../../config/db.js';

export async function getAllPhotos() {
    const result = await pool.query(`
        SELECT
          photos.id,
          photos.s3_key,
          photos.filename,
          photos.owner_display_name,
          photos.date_taken,
          photos.created_at,
          categories.name AS category
        FROM photos
          LEFT JOIN categories ON categories.id = photos.category_id
          ORDER BY photos.created_at DESC 
    `);
    return result.rows;
}

export async function deletePhoto(id, ownerUid) {
    const result = await pool.query(
        'DELETE FROM photos WHERE id = $1 AND owner_uid = $2 RETURNING id',
        [id, ownerUid]
    );
    return result.rowCount > 0;
}