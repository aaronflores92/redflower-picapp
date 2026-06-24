import Header from '../components/Header';
import './ProfilePage.css';

const MOCK_USER = {
    name: 'Aaron Flores',
    email: 'user@redflowerpics.dev',
}

function ProfilePage() {
    function handleResetPassword() {
        // placeholder that will be wired up once real auth is added
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
                    <h2 className="profile-name">{MOCK_USER.name}</h2>
                    <p className="profile-email">{MOCK_USER.email}</p>
                    <hr className="profile-divider" />
                    <button className="reset-password-btn" onClick={handleResetPassword}>
                        Reset Password
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;