import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function Dashboard() {
    const navigate = useNavigate();
    const username = localStorage.getItem("username") || "Tân";
    const [healthData, setHealthData] = useState({ heartRate: '--', bloodPressure: '--/--', bloodSugar: '--', status: 'Đang tải...' });

    // Lấy dữ liệu thật từ MongoDB khi vừa vào trang
    useEffect(() => {
        axios.get(`http://localhost:3001/api/get-health/${username}`)
            .then(res => setHealthData(res.data))
            .catch(() => console.log("Chưa có dữ liệu cũ"));
    }, [username]);

    return (
        <div className="dashboard-container">
            <aside className="dashboard-sidebar">
                <h2 className="brand-name">MediCare</h2>
                <nav className="sidebar-nav">
                    <div className="nav-item active" onClick={() => navigate('/dashboard')}>Tổng quan</div>
                    <div className="nav-item" onClick={() => navigate('/ai-consult')}>Tư vấn bằng AI</div>
                    <div className="nav-item" onClick={() => navigate('/update-health')}>Cập nhật chỉ số</div>
                    <div className="nav-item">Hồ sơ bệnh án</div>
                    <div className="nav-item">Quản lý bác sĩ</div>
                    <div className="nav-item">Tạo hồ sơ bệnh án</div>
                    <div className="nav-item">Quản lý bác sĩ</div>
                </nav>
                <button className="logout-btn" onClick={() => { localStorage.clear(); navigate('/login'); }}>Đăng xuất</button>
            </aside>

            <main className="dashboard-main">
                <header className="main-header">
                    <h1>Chào bạn, {username}</h1>
                </header>

                <section className="ai-banner" onClick={() => navigate('/ai-consult')}>
                    <h2>Trò chuyện với AI Gemini</h2>
                    <p>Dựa trên chỉ số {healthData.heartRate} bpm của bạn, hãy hỏi AI ngay!</p>
                    <button className="ai-go-btn">Hỏi AI ngay</button>
                </section>
            </main>
        </div>
    );
}

export default Dashboard;