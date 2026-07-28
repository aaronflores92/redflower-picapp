import admin from 'firebase-admin';

import { config } from './env.js';

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: config.firebaseProjectId,
        clientEmail: config.firebaseClientEmail,
        privateKey: config.firebasePrivateKey.replace(/\\n/g, '\n'),
    }),
});

export const firebaseAuth = admin.auth();