import { useState } from 'react';

import './UploadModal.css';

function UploadModal({ onClose, onConfirm }) {
    const [previews, setPreviews] = useState([]);

    function handleFileChange(e) {
        const files = Array.from(e.target.files);
        const urls = files.map(file => ({
            url: URL.createObjectURL(file),
            alt: file.name,
        }));
        setPreviews(urls);
    }

    function handleConfirm() {
        onConfirm(previews);
    }

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Add Photos</h2>
                <input type="file" multiple accept="image/*" onChange={handleFileChange} />
                {previews.length > 0 && (
                    <div className="modal-preview-grid">
                        {previews.map((p, i) => (
                            <img key={i} src={p.url} alt={p.alt} />
                        ))}
                    </div>
                )}
                <div className="modal-actions">
                    <button className="btn" onClick={onClose}>Cancel</button>
                    <button
                        className="btn btn-primary"
                        onClick={handleConfirm}
                        disabled={previews.length === 0}
                    >
                        Upload
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UploadModal;