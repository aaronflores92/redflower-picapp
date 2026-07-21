// Loads and validates the ENV VARS from the .env file
import 'dotenv/config';

function required(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

export const config = {
    port: process.env.PORT || 4000,
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    databaseUrl: required('DATABASE_URL'),
    firebaseProjectId: required('FIREBASE_PROJECT_ID'),
    firebaseClientEmail: required('FIREBASE_CLIENT_EMAIL'),
    firebasePrivateKey: required('FIREBASE_PRIVATE_KEY'),
    awsRegion: process.env.AWS_REGION || 'us-east-1',
    s3BucketName: process.env.S3_BUCKET_NAME,
};