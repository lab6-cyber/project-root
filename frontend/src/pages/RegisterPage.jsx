import React, { useState } from 'react';
import { register } from '../api/auth';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
    const [form, setForm] = useState({ email: '', password: '', name: '' });
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(form);
            alert('Регистрация успешна! Теперь войдите.');
            navigate('/login');
        } catch (e) {
            setError('Ошибка регистрации. Возможно, email занят.');
        }
    };

    return (
        <div className="auth-container">
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 style={{textAlign: 'center', marginBottom: '24px'}}>Регистрация</h2>
                {error && <p style={{color: 'red', textAlign: 'center'}}>{error}</p>}
                <form onSubmit={handleSubmit} className="form-group">
                    <input placeholder="Имя" onChange={e => setForm({...form, name: e.target.value})} required />
                    <input placeholder="Email" type="email" onChange={e => setForm({...form, email: e.target.value})} required />
                    <input type="password" placeholder="Пароль" onChange={e => setForm({...form, password: e.target.value})} required />
                    <button type="submit">Создать аккаунт</button>
                </form>
                <Link to="/login" className="link-text">Уже есть аккаунт? Войти</Link>
            </div>
        </div>
    );
};

export default RegisterPage;