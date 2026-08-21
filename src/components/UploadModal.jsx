import { useEffect, useState } from 'react';
import exifr from 'exifr';

import { useApi, uploadFileToS3 } from '../api';

import './UploadModal.css';

async function getDateTaken(file) {
    try {
        const output = await exifr.parse(file, { pick: ['DateTimeOriginal'] });
        const date = output?.DateTimeOriginal;
        return date instanceof Date ? date.toISOString().slice(0, 10) : null;
    } catch {
        return null;
    }
}

function UploadModal({ onClose, onConfirm }) {
    const api = useApi();
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState('');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        api.getCategories()
            .then(data => setCategories(data.categories))
            .catch(err => setError(err.message));
    }, []);

    function handleFileChange(e) {
        const files = Array.from(e.target.files);
        const newItems = files.map(file => ({
            file,
            previewUrl: URL.createObjectURL(file),
        }));
        setItems(newItems);
    }

    async function handleConfirm() {
        setUploading(true);
        setError('');

        try {
            const uploadedPhotos = await Promise.all(items.map(async ({ file }) => {
                const dateTaken = await getDateTaken(file);
                const { uploadUrl, s3Key } = await api.presignUpload({
                    filename: file.name,
                    contentType: file.type,
                });

                await uploadFileToS3(uploadUrl, file);

                const { photo } = await api.confirmUpload({
                    s3Key,
                    filename: file.name,
                    contentType: file.type,
                    sizeBytes: file.size,
                    categoryId: Number(categoryId),
                    dateTaken,
                });

                return photo;
            }));

            onConfirm(uploadedPhotos);
        } catch (err) {
            setError(err.message);
            setUploading(false);
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Add Photos</h2>
                <input type="file" multiple accept="image/*" onChange={handleFileChange} disabled={uploading} />
                <select value={categoryId} onChange={e => setCategoryId(e.target.value)} disabled={uploading}>
                    <option value="">Select a category</option>
                    {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
                {items.length > 0 && (
                    <div className="modal-preview-grid">
                        {items.map((item, i) => (
                            <img key={i} src={item.previewUrl} alt={item.file.name} />
                        ))}
                    </div>
                )}
                {error && <p className="error-text">{error}</p>}
                <div className="modal-actions">
                    <button className="btn" onClick={onClose} disabled={uploading}>Cancel</button>
                    <button
                        className="btn btn-primary"
                        onClick={handleConfirm}
                        disabled={items.length === 0 || !categoryId || uploading}
                    >
                        {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UploadModal;
