import React from 'react';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import { createOrder } from '../api/orders';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
    const { items, clearCart } = useCartStore();
    const { user } = useAuthStore();
    const navigate = useNavigate();

    const handleCheckout = async () => {
        if (!user) {
            alert('Сначала войдите в систему');
            return navigate('/login');
        }

        if (items.length === 0) return;

        const total = items.reduce((acc, item) => acc + item.price, 0);

        try {
            const response = await createOrder({
                userId: user.id,
                userName: user.name,
                items: items.map(i => ({
                    productId: i.id,
                    title: i.title,
                    quantity: 1,
                    price: i.price,
                    image_url: i.image_url
                })),
                total,
                address: "Адрес доставки"
            });

            if (response.data) {
                alert('Заказ успешно оформлен!');
                clearCart(user.id); // Очищаем корзину в сторе и в localStorage для этого юзера
                navigate('/profile');
            }
        } catch (e) {
            console.error(e);
            alert('Ошибка при оформлении заказа. Сервис заказов недоступен.');
        }
    };

    return (
        <div className="container" style={{ marginTop: '50px' }}>
            <h1>Ваша корзина</h1>
            {items.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '100px 0', color: '#94a3b8' }}>Корзина пуста</p>
            ) : (
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    {items.map((item, idx) => (
                        <div key={idx} className="cart-item" style={{ display: 'flex', gap: '20px', padding: '20px 0', borderBottom: '1px solid #eee', alignItems: 'center' }}>
                            <img src={item.image_url || 'https://placehold.co/100x130'} style={{ width: '80px', height: '110px', objectFit: 'cover', borderRadius: '4px' }} alt="" />
                            <div style={{ flex: 1 }}>
                                <h3 style={{ margin: 0 }}>{item.title}</h3>
                                <p style={{ color: '#6366f1', fontWeight: '700', fontSize: '1.1rem' }}>{item.price.toLocaleString()} ₽</p>
                            </div>
                        </div>
                    ))}
                    <div style={{ textAlign: 'right', marginTop: '40px' }}>
                        <h2 style={{ marginBottom: '30px' }}>Итого: {items.reduce((a, b) => a + b.price, 0).toLocaleString()} ₽</h2>
                        <button
                            onClick={handleCheckout}
                            className="btn-primary"
                            style={{ padding: '18px 60px', fontSize: '1.1rem' }}
                        >
                            Оформить заказ
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;