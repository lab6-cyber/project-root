import React, { useEffect, useState } from 'react';
import useAuthStore from '../store/useAuthStore';
import { getOrders } from '../api/orders';

const ProfilePage = () => {
    const { user } = useAuthStore();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (user) {
            getOrders(user.id).then(res => setOrders(res.data));
        }
    }, [user]);

    return (
        <div className="container" style={{marginTop:'50px'}}>
            <div className="card" style={{maxWidth:'100%', marginBottom:'40px'}}>
                <h2 style={{margin:0}}>Личный кабинет</h2>
                <p style={{color:'#64748b'}}>Добро пожаловать, {user?.name}! Здесь ваша история заказов.</p>
            </div>

            <h3>Мои заказы</h3>
            {orders.length === 0 ? <p>У вас еще нет заказов.</p> : (
                <div>
                    {orders.map(order => (
                        <div key={order.id} className="card" style={{maxWidth:'100%', marginBottom:'20px', padding:'30px'}}>
                            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px', borderBottom:'1px solid #eee', paddingBottom:'15px'}}>
                                <div>
                                    <b>Заказ №{order.id}</b>
                                    <div style={{fontSize:'0.8rem', color:'#94a3b8'}}>{new Date(order.created_at).toLocaleString()}</div>
                                </div>
                                <div style={{
                                    background: order.status === 'Доставлен' ? '#dcfce7' : '#ebf1ff',
                                    color: order.status === 'Доставлен' ? '#166534' : '#6366f1',
                                    padding: '5px 15px', borderRadius:'20px', fontSize:'0.8rem', fontWeight:'700', height:'fit-content'
                                }}>
                                    {order.status}
                                </div>
                            </div>
                            <div>
                                {order.items.map((item, i) => (
                                    <div key={i} style={{display:'flex', alignItems:'center', gap:'15px', marginBottom:'10px'}}>
                                        <img src={item.image_url} style={{width:'40px', height:'50px', objectFit:'cover', borderRadius:'4px'}} />
                                        <span>{item.title} x {item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{textAlign:'right', fontWeight:'700', fontSize:'1.2rem', marginTop:'10px'}}>
                                Итого: {order.total} ₽
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProfilePage;