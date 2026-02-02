import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import useCartStore from '../store/useCartStore';

const Navbar = () => {
    const { user, logout } = useAuthStore();
    const clearCart = useCartStore((state) => state.clearCart);
    const cartItems = useCartStore((state) => state.items);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();     // Сброс юзера
        clearCart();  // Очистка корзины
        navigate('/login');
    };

    return (
        <nav>
            <div className="container nav-content">
                <Link to="/" className="logo">MODA</Link>
                <div className="nav-links">
                    <Link to="/">Каталог</Link>
                    <Link to="/cart">Корзина ({cartItems.length})</Link>
                    {user ? (
                        <>
                            <Link to="/profile">Профиль</Link>
                            {user.role === 'admin' && <Link to="/admin">Админ-панель</Link>}
                            <button onClick={handleLogout} className="btn-primary" style={{ marginLeft: '30px', padding: '8px 20px', fontSize: '0.8rem' }}>
                                Выйти ({user.name})
                            </button>
                        </>
                    ) : (
                        <Link to="/login">Войти</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
