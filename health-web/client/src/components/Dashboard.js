import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Dashboard() {
    const navigate = useNavigate();
    const currentUserName = localStorage.getItem("username") || "Bạn";

    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <h2 style={{ color: '#2563eb', marginBottom: '2rem' }}>🏥 MediCare</h2>
                <nav style={{ flex: 1 }}>
                    <div className="nav-item active">🏠 Tổng quan</div>
                    <div className="nav-item">📅 Đặt lịch khám</div>
                    <div className="nav-item">🤖 Tư vấn AI</div>
                </nav>
                <button className="auth-button" style={{ background: '#fee2e2', color: '#ef4444' }} onClick={() => { localStorage.clear(); navigate('/login'); }}>
                    Đăng xuất
                </button>
            </aside>

            <main className="main-content">
                <header>
                    <h1>Chào bạn, {currentUserName}! 👋</h1>
                    <p>Chào mừng bạn quay trở lại hệ thống y tế Duy Tân.</p>
                </header>
                <div className="stats-grid">
                    <div className="stat-card"><h3>Nhịp tim</h3><div className="value">80 <small>bpm</small></div></div>
                    <div className="stat-card"><h3>Huyết áp</h3><div className="value">120/80</div></div>
                </div>
            </main>
        </div>
    );
}
export default Dashboard;