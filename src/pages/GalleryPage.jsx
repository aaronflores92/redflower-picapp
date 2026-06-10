import Header from '../components/Header';

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
    return (
        <div className="gallery-page">
            <Header />
            <h1>Gallery</h1>
            <div className="photo-grid">
                {MOCK_PHOTOS.map((photo) => (
                    <img
                        key={photo.id}
                        src={photo.url}
                        alt={photo.alt}
                    />
                ))}
            </div>
        </div>
    );
}

export default GalleryPage;