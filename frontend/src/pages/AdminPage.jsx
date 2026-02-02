import React, { useState, useEffect } from 'react';
import { createProduct, getProducts, updateProduct, deleteProduct } from '../api/products';
import { getOrders, updateOrderStatus } from '../api/orders';

const AdminPage = () => {
    const [tab, setTab] = useState('products');
    const [products, setProducts] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [allOrders, setAllOrders] = useState([]);
    const [form, setForm] = useState({ title: '', price: '', description: '', stock: '', image_url: '' });

    useEffect(() => {
        if (tab === 'list') loadProducts();
        if (tab === 'orders') loadOrders();
    }, [tab]);

    const loadProducts = () => getProducts().then(res => setProducts(res.data));
    const loadOrders = () => getOrders(null, true).then(res => setAllOrders(res.data));

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateProduct(editingId, form);
                alert('Обновлено');
                setEditingId(null);
            } else {
                await createProduct(form);
                alert('Создано');
            }
            setForm({ title: '', price: '', description: '', stock: '', image_url: '' });
            setTab('list');
        } catch (e) { alert('Ошибка'); }
    };

    const startEdit = (p) => {
        setForm({ title: p.title, price: p.price, description: p.description, stock: p.stock, image_url: p.image_url });
        setEditingId(p.id);
        setTab('products');
    };

    const removeProduct = async (id) => {
        if (window.confirm('Удалить товар?')) {
            await deleteProduct(id);
            loadProducts();
        }
    };

    const changeStatus = async (id, status) => {
        await updateOrderStatus(id, status);
        loadOrders();
    };

    return (
        <div className="container" style={{ marginTop: '50px' }}>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '50px', justifyContent: 'center' }}>
                <button onClick={() => { setTab('products'); setEditingId(null); }} className="btn-primary" style={{ background: tab === 'products' ? '#6366f1' : '#1e293b' }}>
                    {editingId ? 'Редактирование' : 'Добавить товар'}
                </button>
                <button onClick={() => setTab('list')} className="btn-primary" style={{ background: tab === 'list' ? '#6366f1' : '#1e293b' }}>Управление товарами</button>
                <button onClick={() => setTab('orders')} className="btn-primary" style={{ background: tab === 'orders' ? '#6366f1' : '#1e293b' }}>Все заказы</button>
            </div>

            {tab === 'products' && (
                <div className="card" style={{ margin: '0 auto' }}>
                    <h2>{editingId ? 'Изменение товара' : 'Новый товар'}</h2>
                    <form onSubmit={handleSubmit} className="form-group">
                        <input placeholder="Название" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                        <input placeholder="Цена" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                        <input placeholder="Количество" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} required />
                        <input placeholder="URL изображения" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} />
                        <textarea placeholder="Описание" style={{ width: '100%', marginBottom: '20px', minHeight: '120px' }} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                        <button type="submit" className="btn-primary">{editingId ? 'Сохранить изменения' : 'Опубликовать'}</button>
                    </form>
                </div>
            )}

            {tab === 'list' && (
                <div className="grid">
                    {products.map(p => (
                        <div key={p.id} className="product-card" style={{ padding: '20px' }}>
                            <img src={p.image_url} style={{ width: '100%', height: '200px', objectFit: 'cover' }} alt="" />
                            <h3 style={{ margin: '15px 0 5px 0' }}>{p.title}</h3>
                            <p>{p.price} ₽</p>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={() => startEdit(p)} style={{ flex: 1, background: '#475569' }}>Правка</button>
                                <button onClick={() => removeProduct(p.id)} style={{ flex: 1, background: '#ef4444' }}>Удалить</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {tab === 'orders' && (
                <div>
                    {allOrders.map(order => (
                        <div key={order.id} className="card" style={{ maxWidth: '100%', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <b>Заказ №{order.id}</b> — {order.user_name}
                                <p>Сумма: {order.total} ₽ | Статус: <b>{order.status}</b></p>
                            </div>
                            <select value={order.status} onChange={(e) => changeStatus(order.id, e.target.value)} style={{ padding: '10px' }}>
                                <option value="Оформлен">Оформлен</option>
                                <option value="В пути">В пути</option>
                                <option value="Доставлен">Доставлен</option>
                                <option value="Отменен">Отменен</option>
                            </select>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminPage;
