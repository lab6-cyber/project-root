import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct } from '../api/products';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';

const ProductPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const addToCart = useCartStore(state => state.addToCart);
    const { user } = useAuthStore();

    useEffect(() => {
        getProduct(id).then(res => setProduct(res.data));
    }, [id]);

    if (!product) return <div className="container" style={{ paddingTop: '100px', textAlign: 'center' }}>Загрузка...</div>;

    return (
        <div className="container" style={{ marginTop: '60px', display: 'flex', gap: '60px' }}>
            <div style={{ flex: 1 }}>
                <img
                    src={product.image_url || 'https://placehold.co/500x600'}
                    style={{ width: '100%', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                    alt={product.title}
                />
            </div>
            <div style={{ flex: 1 }}>
                <h1 style={{ textAlign: 'left', marginBottom: '10px' }}>{product.title}</h1>
                <p style={{ color: '#6366f1', fontSize: '2.5rem', fontWeight: '800', marginBottom: '20px' }}>
                    {product.price.toLocaleString()} ₽
                </p>
                <p style={{ color: '#64748b', fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '30px' }}>
                    {product.description || 'Описание отсутствует.'}
                </p>
                <div style={{ padding: '20px', background: '#f1f5f9', borderRadius: '12px', marginBottom: '40px' }}>
                    <span style={{ color: '#475569' }}>Наличие на складе:</span>
                    <b style={{ marginLeft: '10px', fontSize: '1.2rem' }}>{product.stock} шт.</b>
                </div>
                <button
                    className="btn-primary"
                    disabled={product.stock <= 0}
                    onClick={() => {
                        addToCart(product, user?.id);
                        alert('Товар добавлен в корзину');
                    }}
                    style={{ padding: '20px 40px', fontSize: '1.1rem' }}
                >
                    {product.stock > 0 ? 'Добавить в корзину' : 'Нет в наличии'}
                </button>
            </div>
        </div>
    );
};

export default ProductPage;