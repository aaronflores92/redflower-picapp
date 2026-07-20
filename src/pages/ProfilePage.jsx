import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';

import { auth } from '../firebase';
import { useAuth } from '../AuthContext';
import Header from '../components/Header';

import './ProfilePage.css';

function ProfilePage() {
    const { user } = useAuth();
    const [resetStatus, setResetStatus] = useState('');
    const [resetMessage, setResetMessage] = useState('');

    async function handleResetPassword() {
        setResetStatus('');
        setResetMessage('');
        try {
            await sendPasswordResetEmail(auth, user.email);
            setResetStatus('success');
            setResetMessage('Password reset email sent. Check your inbox.')
        } catch (err) {
            setResetStatus('error');
            setResetMessage('Something went wrong. Please try again.');
        }
    }

    return (
        <div className="profile-page">
            <Header />
            <div className="profile-center">
                <div className="profile-card">
                    <div className="avatar-circle">
                        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="50" cy="38" r="22" />
                            <ellipse cx="50" cy="90" rx="34" ry="22" />
                        </svg>
                    </div>
                    <h2 className="profile-name">{user?.displayName || 'No name set'}</h2>
                    <p className="profile-email">{user?.email}</p>
                    <hr className="profile-divider" />
                    <button className="reset-password-btn" onClick={handleResetPassword}>
                        Reset Password
                    </button>
                    {resetMessage && (
                        <p className={resetStatus === 'success' ? 'success-text' : 'error-text'}>
                            {resetMessage}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;