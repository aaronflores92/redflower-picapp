// Creates a shared S3 client used for presigned file updload/downloads;

import { S3Client } from '@aws-sdk/client-s3';

import { config } from './env.js';

export const s3Client = new S3Client({
    region: config.awsRegion,
});