// Wraps fetch calls to the Express API — attaches the Firebase ID token
// and resolves paths against the API's base URL.

import { useAuth } from './AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function apiFetch(path, { user, method = 'GET', body } = {}) {
    const headers = {};

    if (body) {
        headers['Content-Type'] = 'application/json';
    }

    if (user) {
        const token = await user.getIdToken();
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.error || `Request failed: ${res.status}`);
    }

    if (res.status === 204) {
        return null;
    }

    return res.json();
}

export function getPhotos(user) {
    return apiFetch('/api/photos', { user });
}

export function deletePhoto(user, id) {
    return apiFetch(`/api/photos/${id}`, { user, method: 'DELETE' });
}

export function getCategories(user) {
    return apiFetch('/api/categories', { user });
}

export function presignUpload(user, { filename, contentType }) {
    return apiFetch('/api/uploads/presign', {
        user,
        method: 'POST',
        body: { filename, contentType },
    });
}

export function confirmUpload(user, payload) {
    return apiFetch('/api/uploads/confirm', {
        user,
        method: 'POST',
        body: payload,
    });
}

// Direct PUT to the presigned S3 URL — not a call to our own API,
// so no auth header and the body is the raw file, not JSON.
export async function uploadFileToS3(uploadUrl, file) {
    const res = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
    });

    if (!res.ok) {
        throw new Error('Failed to upload file to S3');
    }
}

// Bundles the API functions with the current user already applied,
// so components don't need to pass `user` into every call.
export function useApi() {
    const { user } = useAuth();
    return {
        getPhotos: () => getPhotos(user),
        deletePhoto: (id) => deletePhoto(user, id),
        getCategories: () => getCategories(user),
        presignUpload: (args) => presignUpload(user, args),
        confirmUpload: (payload) => confirmUpload(user, payload),
    };
}