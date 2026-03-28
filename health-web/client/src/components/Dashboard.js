import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function Dashboard() {
    const navigate = useNavigate();
    const username = localStorage.getItem("username") || "Người dùng";
    const role = localStorage.getItem("role") || "user";

    const [healthData, setHealthData] = useState({
        heartRate: '--',
        bloodPressure: '--/--',
        bloodSugar: '--',
        status: 'Chưa có dữ liệu'
    });

    // 1. Lấy dữ liệu sức khỏe từ Server
    useEffect(() => {
        if (role === 'user') {
            axios.get(`http://localhost:3001/api/get-health/${username}`)
                .then(res => {
                    if (res.data) setHealthData(res.data);
                })
                .catch(() => console.log("Không tìm thấy dữ liệu sức khỏe cũ."));
        }
    }, [username, role]);

    return (
        <div className="dashboard-container">
            {/* --- SIDEBAR --- */}
            <aside className="dashboard-sidebar">
                <h2 className="brand-name">MediCare</h2>

                <nav className="sidebar-nav">
                    <div className="nav-item active" onClick={() => navigate('/dashboard')}>Tổng quan</div>

                    {/* MENU CHO ADMIN */}
                    {role === 'admin' && (
                        <>
                            <div className="nav-item" style={{ color: '#d97706' }} onClick={() => navigate('/admin/create-doctor')}>Tạo tài khoản BS</div>
                            <div className="nav-item" style={{ color: '#d97706' }} onClick={() => navigate('/admin/stats')}>Thống kê hệ thống</div>
                            <div className="nav-item" style={{ color: '#d97706' }} onClick={() => navigate('/admin/doctors')}>Quản lý Bác sĩ</div>
                        </>
                    )}

                    {/* MENU CHO BÁC SĨ */}
                    {role === 'doctor' && (
                        <>
                            <div className="nav-item" style={{ color: '#10b981' }} onClick={() => navigate('/doctor/appointments')}>Lịch hẹn hôm nay</div>
                            <div className="nav-item" style={{ color: '#10b981' }} onClick={() => navigate('/doctor/patients')}>Quản lý bệnh nhân</div>
                        </>
                    )}

                    {/* MENU CHO BỆNH NHÂN */}
                    {role === 'user' && (
                        <>
                            <div className="nav-item" onClick={() => navigate('/update-health')}>Cập nhật sức khỏe</div>
                            <div className="nav-item" onClick={() => navigate('/ai-consult')}>Tư vấn AI Gemini</div>
                            <div className="nav-item" onClick={() => navigate('/my-records')}>Hồ sơ của tôi</div>
                            <div className="nav-item" onClick={() => navigate('/create-record')}>Tạo hồ sơ bệnh án</div>
                        </>
                    )}

                </nav>

                <button className="logout-btn" onClick={() => { localStorage.clear(); navigate('/login'); }}>Đăng xuất</button>
            </aside>

            {/* --- NỘI DUNG CHÍNH --- */}
            <main className="dashboard-main">
                <header className="main-header">
                    <div>
                        <h1>Chào bạn, {username}</h1>
                        <p style={{ color: '#64748b', fontWeight: '600' }}>
                            Vai trò: {role === 'admin' ? '🔴 Quản trị viên' : role === 'doctor' ? '🟢 Bác sĩ' : '🔵 Bệnh nhân'}
                        </p>
                    </div>
                </header>

                {/* HIỂN THỊ BANNER THEO VAI TRÒ */}
                {role === 'admin' && (
                    <section className="dashboard-ai-box" style={{ background: 'linear-gradient(135deg, #d97706, #f59e0b)' }}>
                        <h2>Bảng Điều Khiển Quản Trị</h2>
                        <p>Chào mừng Admin. Bạn có thể quản lý danh sách bác sĩ và theo dõi tình trạng hệ thống tại đây.</p>
                        <button className="dashboard-ai-btn" onClick={() => navigate('/admin/stats')}>Xem Thống Kê Tổng</button>
                    </section>
                )}

                {role === 'doctor' && (
                    <section className="dashboard-ai-box" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                        <h2>Giao Diện Bác Sĩ</h2>
                        <p>Hôm nay bạn có danh sách bệnh nhân cần tư vấn. Kiểm tra các chỉ số cảnh báo ngay.</p>
                        <button className="dashboard-ai-btn" onClick={() => navigate('/doctor/appointments')}>Xem Lịch Hẹn</button>
                    </section>
                )}

                {role === 'user' && (
                    <>
                        <section className="ai-banner" onClick={() => navigate('/ai-consult')}>
                            <h2>Trò chuyện với AI Gemini</h2>
                            <p>Dựa trên nhịp tim {healthData.heartRate} bpm của bạn, hãy hỏi AI ngay!</p>
                            <button className="ai-go-btn">Hỏi AI ngay</button>
                        </section>

                        <div className="stats-grid" style={{ marginTop: '20px' }}>
                            <div className="stat-card">
                                <h3>Huyết áp</h3>
                                <p className="stat-value">{healthData.bloodPressure}</p>
                                <p className="stat-label">mmHg</p>
                            </div>
                            <div className="stat-card">
                                <h3>Đường huyết</h3>
                                <p className="stat-value">{healthData.bloodSugar}</p>
                                <p className="stat-label">mg/dL</p>
                            </div>
                            <div className="stat-card">
                                <h3>Trạng thái</h3>
                                <p className="stat-value" style={{ fontSize: '1.2rem', color: healthData.status.includes('Cao') ? '#ef4444' : '#10b981' }}>
                                    {healthData.status}
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

export default Dashboard;