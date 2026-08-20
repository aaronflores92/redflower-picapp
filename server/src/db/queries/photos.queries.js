// Query functions to retrieve, delete, and insert data to and from the photos table

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

export async function insertPhoto({ ownerUid, ownerDisplayName, s3Key, filename, contentType, sizeBytes, categoryId, dateTaken }) {
    const result = await pool.query(`
        INSERT INTO photos (owner_uid, owner_display_name, s3_key, filename, content_type, size_bytes, category_id, date_taken)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id
    `,
    [ownerUid, ownerDisplayName, s3Key, filename, contentType, sizeBytes, categoryId, dateTaken]
    );

    return result.rows[0].id;
}

export async function getPhotoById(id) {
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
            LEFT JOIN categories on categories.id = photos.category_id
        WHERE photos.id = $1
    `,
    [id]);

    return result.rows[0];
}