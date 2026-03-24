import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import logoHealth from '../assets/logo-medicare.png'; // Import ảnh logo

function Login() {
    const [loginKey, setLoginKey] = useState(''); // Ô này nhận cả Email, SĐT hoặc CCCD
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/login', { loginKey, password })
            .then(result => {
                if (result.data === "Success") {
                    navigate('/dashboard');
                } else {
                    alert(result.data);
                }
            })
            .catch(err => {
                console.log(err);
                alert("Lỗi kết nối đến server!");
            });
    };

    return (
        <div className="auth-container">
            {/* Logo thương hiệu bôi đậm */}
            <div className="brand-logo-wrapper" onClick={() => navigate('/')}>
                <img src={logoHealth} alt="Medicare Logo" className="brand-icon" />
                <h1 className="brand-logo-text">MediCare</h1>
            </div>

            <div className="auth-card">
                <h2>Đăng Nhập</h2>
                <form onSubmit={handleLogin}>
                    <input type="text"
                        placeholder="Email, Số điện thoại hoặc số CCCD"
                        className="auth-input"
                        onChange={(e) => setLoginKey(e.target.value)} required
                    />
                    <input type="password" placeholder="Mật khẩu" className="auth-input"
                        onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit" className="btn-primary">Đăng Nhập</button>
                </form>
                <div style={{ marginTop: '15px' }}>
                    <span className="auth-footer-link">Quên mật khẩu?</span>
                </div>
                <div className="divider"></div>
                <button className="btn-secondary" onClick={() => navigate('/register')}>
                    Tạo tài khoản mới
                </button>
            </div>
        </div>
    );
}

export default Login;