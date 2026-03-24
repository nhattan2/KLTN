import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Dashboard() {
    const navigate = useNavigate();
    const username = localStorage.getItem("username") || "Tân";

    return (
        <div className="dashboard-container">
            {/* Sidebar chuyên nghiệp */}
            <aside className="dashboard-sidebar">
                <h2 style={{ color: '#2563eb', fontSize: '1.8rem', fontWeight: '800', marginBottom: '3rem' }}>MediCare</h2>
                <nav style={{ flex: 1 }}>
                    <div className="dashboard-nav-item active">🏠 Tổng quan</div>
                    <div className="dashboard-nav-item">📅 Đặt lịch khám</div>
                    <div className="dashboard-nav-item">🤖 Tư vấn AI</div>
                    <div className="dashboard-nav-item">📂 Hồ sơ của tôi</div>
                </nav>
                <button
                    onClick={() => { localStorage.clear(); navigate('/login'); }}
                    style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}
                >
                    Đăng xuất
                </button>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                <header>
                    <h1 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#1e293b' }}>Chào bạn, {username}! 👋</h1>
                    <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '8px' }}>Hôm nay bạn cảm thấy thế nào?</p>
                </header>

                {/* Các thẻ chỉ số Health */}
                <div className="dashboard-stats-grid">
                    <div className="dashboard-stat-card">
                        <h3 style={{ color: '#64748b', fontSize: '1rem' }}>❤️ Nhịp tim</h3>
                        <div style={{ fontSize: '2.2rem', fontWeight: '800', margin: '10px 0' }}>78 <small style={{ fontSize: '1rem' }}>bpm</small></div>
                        <div style={{ color: '#10b981', fontWeight: '600' }}>● Đang ổn định</div>
                    </div>

                    <div className="dashboard-stat-card">
                        <h3 style={{ color: '#64748b', fontSize: '1rem' }}>🩸 Huyết áp</h3>
                        <div style={{ fontSize: '2.2rem', fontWeight: '800', margin: '10px 0' }}>120/80</div>
                        <div style={{ color: '#10b981', fontWeight: '600' }}>● Chỉ số đẹp</div>
                    </div>

                    <div className="dashboard-stat-card">
                        <h3 style={{ color: '#64748b', fontSize: '1rem' }}>🌡️ Nhiệt độ</h3>
                        <div style={{ fontSize: '2.2rem', fontWeight: '800', margin: '10px 0' }}>36.5<small style={{ fontSize: '1rem' }}>°C</small></div>
                        <div style={{ color: '#10b981', fontWeight: '600' }}>● Bình thường</div>
                    </div>
                </div>

                {/* Phần AI Gemini nổi bật */}
                <section className="dashboard-ai-box">
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '700' }}>Trò chuyện với AI Gemini</h2>
                    <p style={{ marginTop: '12px', opacity: '0.9', maxWidth: '550px', fontSize: '1.1rem' }}>
                        Mô tả triệu chứng của bạn để nhận tư vấn sức khỏe tức thì từ trí tuệ nhân tạo hàng đầu Duy Tân.
                    </p>
                    <button className="dashboard-ai-btn">Hỏi AI ngay</button>
                </section>
            </main>
        </div>
    );
}

export default Dashboard;