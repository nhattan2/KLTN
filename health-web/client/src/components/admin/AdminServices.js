import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminServices() {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({ name: '', description: '', price: '', category: 'kham-tong-quat' });

    const categories = [
        { value: 'kham-tong-quat', label: 'Khám tổng quát' },
        { value: 'chuyen-khoa', label: 'Chuyên khoa' },
        { value: 'xet-nghiem', label: 'Xét nghiệm' },
        { value: 'sieu-am', label: 'Siêu âm & Chẩn đoán' }
    ];

    const fetchServices = () => {
        axios.get('http://localhost:3001/api/admin/services')
            .then(res => { setServices(res.data); setLoading(false); })
            .catch(() => setLoading(false));
    };

    useEffect(() => { fetchServices(); }, []);

    const formatVND = (num) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await axios.put(`http://localhost:3001/api/admin/services/${editId}`, { ...form, price: Number(form.price) });
            } else {
                await axios.post('http://localhost:3001/api/admin/services', { ...form, price: Number(form.price) });
            }
            setShowForm(false);
            setEditId(null);
            setForm({ name: '', description: '', price: '', category: 'kham-tong-quat' });
            fetchServices();
        } catch (err) {
            alert("Lỗi lưu dịch vụ!");
        }
    };

    const handleEdit = (service) => {
        setEditId(service._id);
        setForm({ name: service.name, description: service.description || '', price: service.price, category: service.category || 'kham-tong-quat' });
        setShowForm(true);
    };

    const handleToggle = async (id) => {
        await axios.patch(`http://localhost:3001/api/admin/services/${id}/toggle`);
        fetchServices();
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Xóa dịch vụ này?")) return;
        await axios.delete(`http://localhost:3001/api/admin/services/${id}`);
        fetchServices();
    };

    if (loading) return <div className="auth-container">Đang tải...</div>;

    return (
        <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h2 style={{ color: '#1e40af', marginBottom: '4px' }}>🏥 Quản lý Dịch vụ khám</h2>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{services.length} dịch vụ trong hệ thống</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ name: '', description: '', price: '', category: 'kham-tong-quat' }); }}
                        className="btn-add" style={{ borderRadius: '12px', padding: '10px 20px', fontWeight: '700' }}>
                        {showForm ? '✕ Đóng' : '+ Thêm dịch vụ'}
                    </button>
                    <button onClick={() => navigate('/dashboard')}
                        style={{ padding: '10px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontWeight: '600', color: '#64748b' }}>
                        ← Dashboard
                    </button>
                </div>
            </div>

            {/* FORM THÊM/SỬA */}
            {showForm && (
                <form onSubmit={handleSubmit} style={{
                    background: 'white', borderRadius: '16px', padding: '20px',
                    border: '1px solid #e2e8f0', marginBottom: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                }}>
                    <h3 style={{ color: '#1e293b', marginBottom: '1rem' }}>{editId ? '✏️ Sửa dịch vụ' : '➕ Thêm dịch vụ mới'}</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                            <label style={{ fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px', fontSize: '0.85rem' }}>Tên dịch vụ</label>
                            <input className="auth-input" placeholder="VD: Khám tổng quát" value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })} required />
                        </div>
                        <div>
                            <label style={{ fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px', fontSize: '0.85rem' }}>Giá (VND)</label>
                            <input className="auth-input" type="number" placeholder="VD: 200000" value={form.price}
                                onChange={e => setForm({ ...form, price: e.target.value })} required />
                        </div>
                        <div>
                            <label style={{ fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px', fontSize: '0.85rem' }}>Danh mục</label>
                            <select className="auth-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                                {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px', fontSize: '0.85rem' }}>Mô tả</label>
                            <input className="auth-input" placeholder="Mô tả ngắn" value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })} />
                        </div>
                    </div>
                    <button type="submit" className="btn-primary" style={{ marginTop: '12px', maxWidth: '200px' }}>
                        {editId ? '💾 Cập nhật' : '✅ Thêm mới'}
                    </button>
                </form>
            )}

            {/* BẢNG DỊCH VỤ */}
            <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc' }}>
                            <th style={{ padding: '14px 16px', textAlign: 'left', color: '#64748b', fontWeight: '600', fontSize: '0.85rem' }}>Tên dịch vụ</th>
                            <th style={{ padding: '14px 16px', textAlign: 'left', color: '#64748b', fontWeight: '600', fontSize: '0.85rem' }}>Danh mục</th>
                            <th style={{ padding: '14px 16px', textAlign: 'right', color: '#64748b', fontWeight: '600', fontSize: '0.85rem' }}>Giá</th>
                            <th style={{ padding: '14px 16px', textAlign: 'center', color: '#64748b', fontWeight: '600', fontSize: '0.85rem' }}>Trạng thái</th>
                            <th style={{ padding: '14px 16px', textAlign: 'center', color: '#64748b', fontWeight: '600', fontSize: '0.85rem' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map(s => (
                            <tr key={s._id} style={{ borderTop: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '14px 16px' }}>
                                    <div style={{ fontWeight: '700', color: '#1e293b' }}>{s.name}</div>
                                    <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{s.description}</div>
                                </td>
                                <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '0.85rem' }}>
                                    {categories.find(c => c.value === s.category)?.label || s.category}
                                </td>
                                <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: '700', color: '#2563eb' }}>
                                    {formatVND(s.price)}
                                </td>
                                <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                                    <span style={{
                                        padding: '4px 12px', borderRadius: '8px', fontWeight: '700', fontSize: '0.8rem',
                                        background: s.active ? '#f0fdf4' : '#fef2f2',
                                        color: s.active ? '#10b981' : '#ef4444'
                                    }}>
                                        {s.active ? 'Hoạt động' : 'Tạm ẩn'}
                                    </span>
                                </td>
                                <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                        <button onClick={() => handleEdit(s)} style={{
                                            padding: '6px 10px', borderRadius: '8px', border: '1px solid #e2e8f0',
                                            background: 'white', cursor: 'pointer', fontSize: '0.8rem'
                                        }}>✏️</button>
                                        <button onClick={() => handleToggle(s._id)} style={{
                                            padding: '6px 10px', borderRadius: '8px', border: '1px solid #e2e8f0',
                                            background: 'white', cursor: 'pointer', fontSize: '0.8rem'
                                        }}>{s.active ? '🔒' : '🔓'}</button>
                                        <button onClick={() => handleDelete(s._id)} style={{
                                            padding: '6px 10px', borderRadius: '8px', border: '1px solid #fca5a5',
                                            background: '#fef2f2', cursor: 'pointer', fontSize: '0.8rem'
                                        }}>🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminServices;
