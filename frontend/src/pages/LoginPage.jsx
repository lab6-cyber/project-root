import React, { useState } from 'react';
import { login } from '../api/auth';
import useAuthStore from '../store/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const setUser = useAuthStore(state => state.setUser);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await login({ email, password });
            localStorage.setItem('accessToken', res.data.accessToken);
            localStorage.setItem('refreshToken', res.data.refreshToken);
            setUser(res.data.user);
            navigate('/');
        } catch (err) {
            setError('Неверные учетные данные');
        }
    };

    return (
        <div className="auth-container">
            <div className="card">
                <h2 style={{ textAlign: 'center', marginBottom: '30px', fontFamily: 'Playfair Display' }}>Авторизация</h2>
                {error && <p style={{ color: '#ef4444', textAlign: 'center', fontSize: '0.9rem' }}>{error}</p>}
                <form onSubmit={handleSubmit} className="form-group">
                    <input
                        type="email"
                        placeholder="Электронная почта"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn-primary">Войти в профиль</button>
                </form>
                <Link to="/register" className="link-text">Создать новый аккаунт</Link>
            </div>
        </div>
    );
};

export default LoginPage;