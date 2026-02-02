import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import { getMe } from './api/auth';
import useAuthStore from './store/useAuthStore';
import useCartStore from './store/useCartStore';

function App() {
    const { user, setUser } = useAuthStore();
    const loadUserCart = useCartStore(state => state.loadUserCart);
    const resetUI = useCartStore(state => state.resetUI);

    useEffect(() => {
        if (localStorage.getItem('accessToken')) {
            getMe().then(res => {
                setUser(res.data);
            }).catch(() => {
                localStorage.clear();
            });
        }
    }, [setUser]);

    // Когда пользователь меняется (логин/логаут), подгружаем его корзину
    useEffect(() => {
        if (user) {
            loadUserCart(user.id);
        } else {
            resetUI();
        }
    }, [user, loadUserCart, resetUI]);

    return (
        <BrowserRouter>
            <Navbar />
            <div style={{ minHeight: '80vh' }}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/product/:id" element={<ProductPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Routes>
            </div>
            <footer style={{ textAlign: 'center', padding: '50px', color: '#94a3b8', fontSize: '0.8rem' }}>
                &copy; 2026 MODA Fashion Group. Все права защищены.
            </footer>
        </BrowserRouter>
    );
}

export default App;