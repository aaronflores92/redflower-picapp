import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
            navigate('/gallery');
        }
        else {
            setError('Invalid username or password.');
        }
    }

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Login!</button>
            </form>
        </div>
    );
}

export default LoginPage;