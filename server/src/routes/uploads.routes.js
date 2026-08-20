// POST /api/uploads/presign - generates a presigned S3 PUT URL for a new upload
// POST /api/uploads/confirm - persists photo metadata after a successful S3 PUT

import crypto from 'crypto';
import express from 'express';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { insertPhoto, getPhotoById } from '../db/queries/photos.queries.js';
import { s3Client } from '../config/s3Client.js';
import { config } from '../config/env.js';
import { authenticate } from '../middleware/authenticate.js';

export const uploadsRouter = express.Router();

uploadsRouter.post('/presign', authenticate, async (req, res, next) => {
    try {
        const { filename, contentType } = req.body;
        const s3Key = `uploads/${req.uid}/${crypto.randomUUID()}-${filename}`;

        const uploadUrl = await getSignedUrl(
            s3Client,
            new PutObjectCommand({ Bucket: config.s3BucketName, Key: s3Key, ContentType: contentType }),
            { expiresIn: 300 }
        );

        res.json({ uploadUrl, s3Key });
    } catch (err) {
        next(err);
    }
});

uploadsRouter.post('/confirm', authenticate, async (req, res, next) => {
    try {
        const { s3Key, filename, contentType, sizeBytes, categoryId, dateTaken } = req.body;

        if (!s3Key.startsWith(`uploads/${req.uid}/`)) {
            return res.status(403).json({ error: 'Invalid s3Key for this user' });
        }

        const id = await insertPhoto({
            ownerUid: req.uid,
            ownerDisplayName: req.displayName,
            s3Key,
            filename,
            contentType,
            sizeBytes,
            categoryId,
            dateTaken,
        });

        const row = await getPhotoById(id);
        const url = await getSignedUrl(
            s3Client,
            new GetObjectCommand({ Bucket: config.s3BucketName, Key: row.s3_key }),
            { expiresIn: 900 }
        );
        const dateForYear = row.date_taken || row.created_at;

        res.status(201).json({
            photo: {
                id: row.id,
                url,
                alt: row.filename,
                category: row.category,
                uploaderName: row.owner_display_name,
                year: new Date(dateForYear).getFullYear(),
            },
        });
    } catch (err) {
        next(err);
    }
});