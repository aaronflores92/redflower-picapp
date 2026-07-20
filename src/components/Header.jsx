import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';

import { auth } from '../firebase';

import './Header.css';

function Header({ showMenu = true }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    function handleGallery() {
        setMenuOpen(false);
        navigate('/gallery');
    }

    function handleProfile() {
        setMenuOpen(false);
        navigate('/profile');
    }

    async function handleLogout() {
        setMenuOpen(false);
        await signOut(auth);
        navigate('/login');
    }

    return(
        <header className="header">
            <span className="header-title">RedFlowerPhotos</span>
            {showMenu && (
                <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                ☰
            </button>
            )}
            {showMenu && menuOpen && (
                <div className="dropdown">
                    <button className={location.pathname === '/gallery' ? 'active' : ''}
                    onClick={handleGallery}>Gallery</button>
                    <button className="disabled" disabled>Add Photos</button>
                    <button className={location.pathname === '/profile' ? 'active' : ''}
                    onClick={handleProfile}>Profile</button>
                    <button onClick={handleLogout}>Log Out</button>
                </div>
            )}
        </header>
    );
}

export default Header