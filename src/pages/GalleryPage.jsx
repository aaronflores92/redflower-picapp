import { useState } from 'react';

import Header from '../components/Header';
import UploadModal from '../components/UploadModal';

import './GalleryPage.css';

const MOCK_PHOTOS = [
    { id: 1, url: 'https://picsum.photos/seed/1/300/300', alt: 'Photo 1' },
    { id: 2, url: 'https://picsum.photos/seed/2/300/300', alt: 'Photo 2' },
    { id: 3, url: 'https://picsum.photos/seed/3/300/300', alt: 'Photo 3' },
    { id: 4, url: 'https://picsum.photos/seed/4/300/300', alt: 'Photo 4' },
    { id: 5, url: 'https://picsum.photos/seed/5/300/300', alt: 'Photo 5' },
    { id: 6, url: 'https://picsum.photos/seed/6/300/300', alt: 'Photo 6' },
    { id: 7, url: 'https://picsum.photos/seed/7/300/300', alt: 'Photo 7' },
    { id: 8, url: 'https://picsum.photos/seed/8/300/300', alt: 'Photo 8' },
    { id: 9, url: 'https://picsum.photos/seed/9/300/300', alt: 'Photo 9' },
    { id: 10, url: 'https://picsum.photos/seed/10/300/300', alt: 'Photo 10' },
    { id: 11, url: 'https://picsum.photos/seed/11/300/300', alt: 'Photo 11' },
    { id: 12, url: 'https://picsum.photos/seed/12/300/300', alt: 'Photo 12' },
];

function GalleryPage() {
    const [photos, setPhotos] = useState(MOCK_PHOTOS);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [showModal, setShowModal] = useState(false);

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

    function handleDeleteSelected() {
        const count = selectedIds.size;
        const confirmed = window.confirm(`Delete ${count} photo${count !== 1 ? 's' : ''}?`);
        if (confirmed) {
            setPhotos(prev => prev.filter(p => !selectedIds.has(p.id)));
            setSelectedIds(new Set());
        }
    }

    function handleUploadConfirm(previews) {
        const newPhotos = previews.map((p, i) => ({
            id: Date.now() + i,
            url: p.url,
            alt: p.alt,
        }));
        setPhotos(prev => [...prev, ...newPhotos]);
        setShowModal(false);
    }

    return (
        <div className="gallery-page">
            <Header />
            <h1>Gallery</h1>
            <div className="gallery-actions">
                <button className="btn btn-primary" onClick={() => { console.log('clicked'); setShowModal(true); }}>
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
            {console.log('showModal:', showModal)}
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