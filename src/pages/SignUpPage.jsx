import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

import { auth } from '../firebase';
import Header from '../components/Header';

import './AuthPage.css';

function SignUpPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            if (name) {
                await updateProfile(userCredential.user, { displayName : name });
            }
            navigate('/gallery');
        } catch (err) {
            switch (err.code) {
                case 'auth/email-already-in-use':
                    setError('An account with this email already exists.');
                    break;
                case 'auth/invalid-email':
                    setError('Please enter a valid email address.');
                    break;
                case 'auth/password-does-not-meet-requirements':
                case 'auth/weak-password':
                    setError('Password should be at least 6 characters and include an uppercase, lowercase, numeric, and special character.');
                    break;
                default:
                    setError('Something went wrong. Please try again.')
            }
        }
    }

    return (
        <div className="login-page">
            <Header showMenu={false} />
            <div className="login-center">
                <div className="login-card">
                    <h1>Sign Up</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Name (optional)</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        {error && <p className="error-text">{error}</p>}
                        <button type="submit" className="login-button">Sign Up!</button>
                        <p className="auth-switch">Already have an account? <Link to="/login">Log In!</Link></p>
                    </form>
                </div>
            </div>
            
        </div>
    );
}

export default SignUpPage;