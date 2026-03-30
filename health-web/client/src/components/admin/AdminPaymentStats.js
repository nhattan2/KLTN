import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminPaymentStats() {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:3001/api/admin/payment-stats')
            .then(res => { setStats(res.data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const formatVND = (num) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    if (loading) return <div className="auth-container">Đang tải thống kê...</div>;

    return (
        <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ color: '#1e40af' }}>💰 Thống kê Doanh thu</h2>
                <button onClick={() => navigate('/dashboard')}
                    style={{ padding: '10px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontWeight: '600', color: '#64748b' }}>
                    ← Dashboard
                </button>
            </div>

            {/* TỔNG QUAN */}
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                <div className="stat-card" style={{ borderTop: '5px solid #10b981' }}>
                    <h3 style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '8px' }}>💰 Tổng doanh thu</h3>
                    <div className="stat-value" style={{ color: '#10b981', fontSize: '1.6rem' }}>
                        {formatVND(stats?.totalRevenue || 0)}
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Từ các giao dịch thành công</p>
                </div>

                <div className="stat-card" style={{ borderTop: '5px solid #2563eb' }}>
                    <h3 style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '8px' }}>📋 Tổng lịch hẹn</h3>
                    <div className="stat-value" style={{ color: '#2563eb', fontSize: '1.6rem' }}>
                        {stats?.totalAppointments || 0}
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Đã đăng ký trong hệ thống</p>
                </div>

                <div className="stat-card" style={{ borderTop: '5px solid #f59e0b' }}>
                    <h3 style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '8px' }}>✅ Giao dịch thành công</h3>
                    <div className="stat-value" style={{ color: '#f59e0b', fontSize: '1.6rem' }}>
                        {stats?.totalPayments || 0}
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Thanh toán hoàn tất</p>
                </div>
            </div>

            {/* DOANH THU THEO DỊCH VỤ */}
            <div style={{
                background: 'white', borderRadius: '16px', padding: '1.5rem',
                border: '1px solid #e2e8f0', marginBottom: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
            }}>
                <h3 style={{ color: '#1e293b', marginBottom: '1rem' }}>📊 Doanh thu theo Dịch vụ</h3>
                {stats?.revenueByService?.length > 0 ? (
                    <div>
                        {stats.revenueByService.map((item, idx) => {
                            const maxVal = stats.revenueByService[0]?.total || 1;
                            const percent = (item.total / maxVal) * 100;
                            return (
                                <div key={idx} style={{ marginBottom: '14px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                        <span style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.9rem' }}>{item._id}</span>
                                        <span style={{ fontWeight: '700', color: '#2563eb', fontSize: '0.9rem' }}>
                                            {formatVND(item.total)} ({item.count} giao dịch)
                                        </span>
                                    </div>
                                    <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: '#f1f5f9' }}>
                                        <div style={{
                                            width: `${percent}%`, height: '100%', borderRadius: '4px',
                                            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                                            transition: 'width 0.5s ease'
                                        }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p style={{ color: '#94a3b8', textAlign: 'center' }}>Chưa có dữ liệu doanh thu</p>
                )}
            </div>

            {/* GIAO DỊCH GẦN ĐÂY */}
            <div style={{
                background: 'white', borderRadius: '16px', padding: '1.5rem',
                border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
            }}>
                <h3 style={{ color: '#1e293b', marginBottom: '1rem' }}>🕐 Giao dịch gần đây</h3>
                {stats?.recentPayments?.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                <th style={{ padding: '10px', textAlign: 'left', color: '#64748b', fontSize: '0.8rem' }}>Mã GD</th>
                                <th style={{ padding: '10px', textAlign: 'left', color: '#64748b', fontSize: '0.8rem' }}>Bệnh nhân</th>
                                <th style={{ padding: '10px', textAlign: 'left', color: '#64748b', fontSize: '0.8rem' }}>Dịch vụ</th>
                                <th style={{ padding: '10px', textAlign: 'right', color: '#64748b', fontSize: '0.8rem' }}>Số tiền</th>
                                <th style={{ padding: '10px', textAlign: 'right', color: '#64748b', fontSize: '0.8rem' }}>Thời gian</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recentPayments.map((p, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #f8fafc' }}>
                                    <td style={{ padding: '10px', fontFamily: 'monospace', fontSize: '0.75rem', color: '#94a3b8' }}>{p.transactionId}</td>
                                    <td style={{ padding: '10px', fontWeight: '600', color: '#1e293b', fontSize: '0.85rem' }}>{p.patientUsername}</td>
                                    <td style={{ padding: '10px', color: '#64748b', fontSize: '0.85rem' }}>{p.serviceName}</td>
                                    <td style={{ padding: '10px', textAlign: 'right', fontWeight: '700', color: '#10b981', fontSize: '0.9rem' }}>{formatVND(p.amount)}</td>
                                    <td style={{ padding: '10px', textAlign: 'right', color: '#94a3b8', fontSize: '0.78rem' }}>{formatDate(p.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p style={{ color: '#94a3b8', textAlign: 'center' }}>Chưa có giao dịch nào</p>
                )}
            </div>
        </div>
    );
}

export default AdminPaymentStats;
