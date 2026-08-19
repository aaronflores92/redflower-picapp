// GET /api/photos - lists all photos w/ pre-signed GET URLs
// DELETE /api/photos/:id - deletes a photo, only runnable by owner

import express from 'express';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { getAllPhotos, deletePhoto } from '../db/queries/photos.queries.js';
import { s3Client } from '../config/s3Client.js';
import { config } from '../config/env.js';
import { authenticate } from '../middleware/authenticate.js';

export const photosRouter = express.Router();

photosRouter.get('/', authenticate, async (req, res, next) => {
    try {
        const rows = await getAllPhotos();
    
        const photos = await Promise.all(rows.map(async (row) => {
            const url = await getSignedUrl(
                s3Client,
                new GetObjectCommand({ Bucket: config.s3BucketName, Key: row.s3_key }),
                { expiresIn: 900 }
            );
        
            const dateForYear = row.date_taken || row.created_at;
        
            return {
                id: row.id,
                url,
                alt: row.filename,
                category: row.category,
                uploaderName: row.owner_display_name,
                year: new Date(dateForYear).getFullYear(),
            };
        }));

        res.json({ photos });
    
    } catch(err) {
        next(err);
    }
});

photosRouter.delete('/:id', authenticate, async (req, res, next) => {
    try {
        const deleted = await deletePhoto(req.params.id, req.uid);
        if (!deleted) {
            return res.status(404).json({ error: 'Photo not found' });
        }
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});