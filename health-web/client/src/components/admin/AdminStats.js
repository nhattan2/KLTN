import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../App.css'; 

function AdminStats() {
    const [stats, setStats] = useState({ userCount: 0, doctorCount: 0, recordCount: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Gọi API lấy thống kê tổng hợp từ Backend
        axios.get('http://localhost:3001/api/admin/stats')
            .then(res => {
                setStats(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi lấy thống kê:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="auth-container">Đang tải dữ liệu hệ thống...</div>;

    return (
        <div className="admin-stats-container" style={{ padding: '20px' }}>
            <h2 style={{ color: '#1e40af', marginBottom: '25px', textAlign: 'left' }}>
                📊 Thống kê Hệ thống Medicare
            </h2>

            <div className="stats-grid">
                {/* Thẻ Thống kê Người dùng */}
                <div className="stat-card" style={{ borderTop: '5px solid #2563eb' }}>
                    <h3>👥 Tổng Bệnh nhân</h3>
                    <div className="stat-value" style={{ color: '#2563eb' }}>{stats.userCount}</div>
                    <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Tài khoản đang hoạt động</p>
                </div>

                {/* Thẻ Thống kê Bác sĩ */}
                <div className="stat-card" style={{ borderTop: '5px solid #10b981' }}>
                    <h3>👨‍⚕️ Đội ngũ Bác sĩ</h3>
                    <div className="stat-value" style={{ color: '#10b981' }}>{stats.doctorCount}</div>
                    <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Đã được cấp tài khoản</p>
                </div>

                {/* Thẻ Thống kê Hồ sơ */}
                <div className="stat-card" style={{ borderTop: '5px solid #f59e0b' }}>
                    <h3>📋 Tổng Hồ sơ bệnh án</h3>
                    <div className="stat-value" style={{ color: '#f59e0b' }}>{stats.recordCount}</div>
                    <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Lần cập nhật chỉ số</p>
                </div>
            </div>

            {/* Khu vực biểu đồ hoặc danh sách hoạt động gần đây */}
            <div style={{ marginTop: '30px', padding: '20px', background: 'white', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <h4 style={{ color: '#475569', marginBottom: '15px' }}>🚀 Hoạt động hệ thống</h4>
                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                    Hệ thống đang vận hành ổn định. Đã kết nối thành công với cơ sở dữ liệu MongoDB.
                </p>
            </div>
        </div>
    );
}

export default AdminStats;