import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PaymentHistory() {
    const navigate = useNavigate();
    const username = localStorage.getItem("username") || "Người dùng";
    const [payments, setPayments] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('payments'); // 'payments' or 'appointments'

    useEffect(() => {
        Promise.all([
            axios.get(`http://localhost:3001/api/payments/${username}`),
            axios.get(`http://localhost:3001/api/appointments/${username}`)
        ]).then(([payRes, appRes]) => {
            setPayments(payRes.data);
            setAppointments(appRes.data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [username]);

    const formatVND = (num) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const getStatusBadge = (status) => {
        const styles = {
            success: { bg: '#f0fdf4', color: '#10b981', text: '✅ Thành công' },
            pending: { bg: '#fffbeb', color: '#f59e0b', text: '⏳ Đang chờ' },
            failed: { bg: '#fef2f2', color: '#ef4444', text: '❌ Thất bại' },
            confirmed: { bg: '#eff6ff', color: '#2563eb', text: '📋 Đã xác nhận' },
            completed: { bg: '#f0fdf4', color: '#10b981', text: '✅ Hoàn thành' },
            cancelled: { bg: '#fef2f2', color: '#ef4444', text: '🚫 Đã hủy' }
        };
        const s = styles[status] || styles.pending;
        return (
            <span style={{
                padding: '4px 12px', borderRadius: '8px',
                background: s.bg, color: s.color,
                fontWeight: '700', fontSize: '0.8rem'
            }}>{s.text}</span>
        );
    };

    const handleCancel = async (id) => {
        if (!window.confirm("Bạn có chắc muốn hủy lịch hẹn này?")) return;
        try {
            await axios.patch(`http://localhost:3001/api/appointments/${id}/cancel`);
            // Refresh data
            const [payRes, appRes] = await Promise.all([
                axios.get(`http://localhost:3001/api/payments/${username}`),
                axios.get(`http://localhost:3001/api/appointments/${username}`)
            ]);
            setPayments(payRes.data);
            setAppointments(appRes.data);
        } catch (err) {
            alert("Lỗi hủy lịch hẹn!");
        }
    };

    if (loading) return <div className="auth-container">Đang tải dữ liệu...</div>;

    return (
        <div className="auth-container">
            <div className="auth-card" style={{ maxWidth: '750px', textAlign: 'left' }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ color: '#2563eb' }}>📜 Lịch sử thanh toán & Lịch hẹn</h2>
                </div>

                {/* TAB SWITCH */}
                <div style={{ display: 'flex', gap: '0', marginBottom: '1.5rem', borderRadius: '12px', overflow: 'hidden', border: '1.5px solid #e2e8f0' }}>
                    <button onClick={() => setTab('payments')} style={{
                        flex: 1, padding: '12px', border: 'none', fontWeight: '700', cursor: 'pointer',
                        background: tab === 'payments' ? '#2563eb' : 'white',
                        color: tab === 'payments' ? 'white' : '#64748b', fontSize: '0.9rem'
                    }}>
                        💳 Thanh toán ({payments.length})
                    </button>
                    <button onClick={() => setTab('appointments')} style={{
                        flex: 1, padding: '12px', border: 'none', fontWeight: '700', cursor: 'pointer',
                        background: tab === 'appointments' ? '#2563eb' : 'white',
                        color: tab === 'appointments' ? 'white' : '#64748b', fontSize: '0.9rem'
                    }}>
                        📋 Lịch hẹn ({appointments.length})
                    </button>
                </div>

                {/* TAB: THANH TOÁN */}
                {tab === 'payments' && (
                    <div>
                        {payments.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                                <p style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>💳</p>
                                <p>Chưa có giao dịch nào</p>
                                <button className="btn-primary" style={{ maxWidth: '200px', margin: '1rem auto' }}
                                    onClick={() => navigate('/book-appointment')}>Đặt lịch ngay</button>
                            </div>
                        ) : (
                            payments.map((p, idx) => (
                                <div key={idx} style={{
                                    padding: '16px', borderRadius: '14px', marginBottom: '10px',
                                    border: '1px solid #e2e8f0', background: 'white'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                        <div>
                                            <div style={{ fontWeight: '700', color: '#1e293b' }}>{p.serviceName}</div>
                                            <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '2px' }}>BS. {p.doctorName} • {p.method === 'online' ? '💳 Online' : '💵 Tiền mặt'}</div>
                                        </div>
                                        {getStatusBadge(p.status)}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ color: '#94a3b8', fontSize: '0.78rem', fontFamily: 'monospace' }}>{p.transactionId}</span>
                                        <span style={{ fontWeight: '800', color: '#2563eb', fontSize: '1.05rem' }}>{formatVND(p.amount)}</span>
                                    </div>
                                    <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '4px' }}>{formatDate(p.createdAt)}</div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* TAB: LỊCH HẸN */}
                {tab === 'appointments' && (
                    <div>
                        {appointments.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                                <p style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📋</p>
                                <p>Chưa có lịch hẹn nào</p>
                            </div>
                        ) : (
                            appointments.map((a, idx) => (
                                <div key={idx} style={{
                                    padding: '16px', borderRadius: '14px', marginBottom: '10px',
                                    border: '1px solid #e2e8f0', background: 'white'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                        <div>
                                            <div style={{ fontWeight: '700', color: '#1e293b' }}>{a.serviceName}</div>
                                            <div style={{ color: '#64748b', fontSize: '0.83rem', marginTop: '2px' }}>BS. {a.doctorName}</div>
                                        </div>
                                        {getStatusBadge(a.status)}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ color: '#475569', fontWeight: '600' }}>📅 {a.appointmentDate} • 🕐 {a.timeSlot}</span>
                                        <span style={{ fontWeight: '700', color: '#2563eb' }}>{formatVND(a.servicePrice)}</span>
                                    </div>
                                    {a.status === 'confirmed' && (
                                        <button onClick={() => handleCancel(a._id)} style={{
                                            marginTop: '10px', padding: '6px 14px', borderRadius: '8px',
                                            border: '1px solid #fca5a5', background: '#fef2f2',
                                            color: '#ef4444', fontWeight: '600', fontSize: '0.8rem', cursor: 'pointer'
                                        }}>
                                            Hủy lịch hẹn
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}

                <button style={{
                    marginTop: '1.5rem', background: 'none', border: 'none',
                    color: '#94a3b8', cursor: 'pointer', fontSize: '0.85rem', width: '100%', textAlign: 'center'
                }} onClick={() => navigate('/dashboard')}>
                    ← Quay về Dashboard
                </button>
            </div>
        </div>
    );
}

export default PaymentHistory;
