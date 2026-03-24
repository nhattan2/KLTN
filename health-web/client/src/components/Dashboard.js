import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Dashboard() {
    const navigate = useNavigate();

    return (
        <div className="dashboard-container">
            {/* 1. Sidebar bên trái */}
            <aside className="sidebar">
                <h2 style={{ color: '#2563eb', marginBottom: '2.5rem', fontSize: '1.5rem' }}>🏥 MediCare</h2>
                <nav style={{ flex: 1 }}>
                    <div className="nav-item active">🏠 Tổng quan</div>
                    <div className="nav-item">📅 Đặt lịch khám</div>
                    <div className="nav-item">🤖 Tư vấn AI</div>
                    <div className="nav-item">📂 Hồ sơ của tôi</div>
                </nav>
                <button
                    onClick={() => navigate('/login')}
                    style={{ padding: '10px', border: 'none', background: '#fee2e2', color: '#ef4444', borderRadius: '8px', cursor: 'pointer' }}
                >
                    Đăng xuất
                </button>
            </aside>

            {/* 2. Nội dung chính bên phải */}
            <main className="main-content">
                <header style={{ marginBottom: '2rem' }}>
                    <h1 style={{ color: '#1e293b' }}>Chào bạn, Nhật Tân! 👋</h1>
                    <p style={{ color: '#64748b' }}>Hôm nay bạn cảm thấy thế nào?</p>
                </header>

                {/* Grid các thẻ chỉ số */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Nhịp tim</h3>
                        <div className="value">78 <small style={{ fontSize: '1rem', color: '#64748b' }}>bpm</small></div>
                        <p style={{ color: '#10b981', fontSize: '0.85rem', marginTop: '10px' }}>● Đang ổn định</p>
                    </div>

                    <div className="stat-card">
                        <h3>Huyết áp</h3>
                        <div className="value">120/80</div>
                        <p style={{ color: '#10b981', fontSize: '0.85rem', marginTop: '10px' }}>● Chỉ số đẹp</p>
                    </div>

                    <div className="stat-card">
                        <h3>Nhiệt độ</h3>
                        <div className="value">36.5°C</div>
                        <p style={{ color: '#10b981', fontSize: '0.85rem', marginTop: '10px' }}>● Bình thường</p>
                    </div>
                </div>

                {/* Khu vực hành động nhanh */}
                <div className="stat-card" style={{ marginTop: '2rem', background: 'linear-gradient(to right, #eff6ff, #ffffff)' }}>
                    <h3 style={{ color: '#2563eb' }}>Trò chuyện với AI Gemini</h3>
                    <p style={{ margin: '15px 0', color: '#475569' }}>Mô tả triệu chứng của bạn để nhận tư vấn sức khỏe từ trí tuệ nhân tạo.</p>
                    <button className="auth-button" style={{ width: '150px', margin: 0 }}>Hỏi AI ngay</button>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;