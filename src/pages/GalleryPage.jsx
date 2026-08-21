import { useEffect, useState } from 'react';

import Header from '../components/Header';
import UploadModal from '../components/UploadModal';
import { useApi } from '../api';

import './GalleryPage.css';

function GalleryPage() {
    const api = useApi();
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        api.getPhotos()
            .then(data => setPhotos(data.photos))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    function handleToggleSelect(id) {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            }
            else {
                next.add(id);
            }
            return next;
        });
    }

    async function handleDeleteSelected() {
        const count = selectedIds.size;
        const confirmed = window.confirm(`Delete ${count} photo${count !== 1 ? 's' : ''}?`);
        if (!confirmed) {
            return;
        }

        try {
            await Promise.all([...selectedIds].map(id => api.deletePhoto(id)));
            setPhotos(prev => prev.filter(p => !selectedIds.has(p.id)));
            setSelectedIds(new Set());
        } catch (err) {
            setError(err.message);
        }
    }

    function handleUploadConfirm(newPhotos) {
        setPhotos(prev => [...prev, ...newPhotos]);
        setShowModal(false);
    }

    return (
        <div className="gallery-page">
            <Header />
            <h1>Gallery</h1>
            {error && <p className="error-text">{error}</p>}
            <div className="gallery-actions">
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    Add Photos
                </button>
                <button
                    className="btn btn-danger"
                    onClick={handleDeleteSelected}
                    disabled={selectedIds.size === 0}
                >
                    Delete Selected {selectedIds.size > 0 ? `(${selectedIds.size})` : ''}
                </button>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="photo-grid">
                    {photos.map((photo) => (
                        <div
                            key={photo.id}
                            className={`photo-card${selectedIds.has(photo.id) ? ' selected' : ''}`}
                            onClick={() => handleToggleSelect(photo.id)}
                        >
                            <img src={photo.url} alt={photo.alt} />
                            {selectedIds.has(photo.id) && <span className="checkmark">✓</span>}
                        </div>
                    ))}
                </div>
            )}
            {showModal && (
                <UploadModal
                    onClose={() => setShowModal(false)}
                    onConfirm={handleUploadConfirm}
                />
            )}
        </div>
    );
}

export default GalleryPage;