import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import logoHealth from '../assets/logo-medicare.png';

function Login() {
    const [loginKey, setLoginKey] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/login', { loginKey, password })
            .then(res => {
                if (res.data.status === "Success") {
                    // LƯU THÔNG TIN QUAN TRỌNG VÀO LOCALSTORAGE
                    localStorage.setItem("username", res.data.username);
                    localStorage.setItem("role", res.data.role); // Dòng này giúp Dashboard phân quyền

                    // Chuyển hướng người dùng vào Dashboard
                    navigate('/dashboard');
                } else {
                    alert(res.data.message);
                }
            })
            .catch(() => alert("Lỗi kết nối server rồi Tân ơi!"));
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="brand-wrapper">
                    <img src={logoHealth} alt="Logo" className="brand-icon-large" />
                    <h1 className="brand-name-large">MEDICARE</h1>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Your Health, Our Mission</p>
                </div>
                <h2>Đăng Nhập</h2>
                <form onSubmit={handleLogin} style={{ marginTop: '1.5rem' }}>
                    <div className="auth-input-group">
                        <input
                            className="auth-input"
                            placeholder="Email hoặc Số điện thoại"
                            onChange={e => setLoginKey(e.target.value)}
                            required
                        />
                    </div>
                    <div className="auth-input-group" style={{ marginTop: '10px' }}>
                        <input
                            className="auth-input"
                            type="password"
                            placeholder="Mật khẩu"
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ marginTop: '20px' }}>
                        Vào Hệ Thống
                    </button>
                </form>
                <p style={{ marginTop: '15px', fontSize: '0.9rem' }}>
                    Chưa có tài khoản? <span onClick={() => navigate('/register')} style={{ color: '#2563eb', cursor: 'pointer', fontWeight: '600' }}>Đăng ký ngay</span>
                </p>
            </div>
        </div>
    );
}

export default Login;