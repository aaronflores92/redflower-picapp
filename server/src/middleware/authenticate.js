// Express middleware that runs in front of protected routes and reads Authorization headers, verifies token w/ firebaseAuth handle, and attaches identity info to request or rejects w/ 401

import { firebaseAuth } from '../config/firebaseAdmin.js';

export async function authenticate(req, res, next) {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
        return res.status(401).json({ error: 'Missing bearer token' });
    }

    try {
        const decoded = await firebaseAuth.verifyIdToken(token);
        req.uid = decoded.uid;
        req.displayName = decoded.name || decoded.email;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
}