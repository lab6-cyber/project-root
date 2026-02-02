import React, { useEffect, useState } from 'react';
import { getProducts } from '../api/products';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        getProducts()
            .then(res => setProducts(res.data))
            .catch(err => console.error(err));
    }, []);

    const placeholder = 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=400&h=550&q=80';

    return (
        <div className="container">
            <h1>Эксклюзивная коллекция</h1>

            {products.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '100px 0' }}>
                    <p style={{ color: '#94a3b8', fontSize: '1.2rem' }}>Коллекция скоро появится в продаже.</p>
                </div>
            ) : (
                <div className="grid">
                    {products.map(p => (
                        <div key={p.id} className="product-card">
                            <img
                                src={p.image_url || placeholder}
                                alt={p.title}
                                className="product-img"
                                onError={(e) => { e.target.src = placeholder; }}
                            />
                            <div className="product-info">
                                <h3 className="product-title">{p.title}</h3>
                                <p className="product-price">{p.price.toLocaleString()} ₽</p>
                                <Link to={`/product/${p.id}`} style={{ textDecoration: 'none' }}>
                                    <button className="btn-primary" style={{ width: '100%' }}>
                                        Детали
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HomePage;