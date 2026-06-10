import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

import './LoginPage.css';

const MOCK_USER = {
    username: 'admin',
    password: 'password123',
}

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        if (username === MOCK_USER.username && password === MOCK_USER.password) {
            localStorage.setItem('isLoggedIn', 'true');
            navigate('/gallery');
        }
        else {
            setError('Invalid username or password.');
        }
    }

    return (
        <div className="login-page">
            <Header showMenu={false} />
            <div className="login-center">
                <div className="login-card">
                    <h1>Login</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {error && <p className="error-text">{error}</p>}
                        <button type="submit" className="login-button">Login!</button>
                    </form>
                </div>
            </div>
            
        </div>
    );
}

export default LoginPage;