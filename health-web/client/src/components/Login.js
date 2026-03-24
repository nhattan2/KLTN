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
            .then(result => {
                if (result.data.status === "Success") {
                    localStorage.setItem("username", result.data.username);
                    navigate('/dashboard');
                } else {
                    alert(result.data.message);
                }
            })
            .catch(() => alert("Lỗi kết nối server!"));
    };

    return (
        <div className="auth-container">
            <div className="brand-logo-wrapper">
                <img src={logoHealth} alt="Logo" className="brand-icon" />
                <h1 className="brand-logo-text">MediCare</h1>
            </div>
            <div className="auth-card">
                <h2>Đăng Nhập</h2>
                <form onSubmit={handleLogin}>
                    <input type="text" placeholder="Email, SĐT hoặc CCCD" className="auth-input" onChange={(e) => setLoginKey(e.target.value)} required />
                    <input type="password" placeholder="Mật khẩu" className="auth-input" onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit" className="btn-primary">Vào Hệ Thống</button>
                </form>
                <div className="divider"></div>
                <button className="btn-secondary" onClick={() => navigate('/register')}>Tạo tài khoản mới</button>
            </div>
        </div>
    );
}
export default Login;