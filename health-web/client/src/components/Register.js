import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import logoHealth from '../assets/logo-medicare.png'; 

function Register() {
    const [formData, setFormData] = useState({
        username: '', email: '', phone: '', cccd: '', password: ''
    });
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Kiểm tra xem đã nhập ít nhất 1 trong 3 thông tin định danh chưa
        if (!formData.email && !formData.phone && !formData.cccd) {
            alert("Vui lòng nhập ít nhất Email, Số điện thoại hoặc Số CCCD!");
            return;
        }

        axios.post('http://localhost:3001/register', formData)
            .then(result => {
                alert("Đăng ký thành công!");
                navigate('/login');
            })
            .catch(err => {
                console.log(err);
                alert("Thông tin này đã được sử dụng hoặc lỗi hệ thống!");
            });
    };

    return (
        <div className="auth-container">
            {/* Logo thương hiệu bôi đậm */}
            <div className="brand-logo-wrapper" onClick={() => navigate('/')}>
                <img src={logoHealth} alt="Medicare Logo" className="brand-icon" />
                <h1 className="brand-logo-text">MediCare</h1>
            </div>

            <div className="auth-card register-card"> {/* Thêm class riêng cho card rộng hơn */}
                <h2>Tạo tài khoản mới</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Họ và tên" className="auth-input" required
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
                    <input type="email" placeholder="Địa chỉ Email (Ví dụ: tan@gmail.com)" className="auth-input"
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })} />

                    <input type="text" placeholder="Số điện thoại (Ví dụ: 0905...)" className="auth-input"
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />

                    <input type="text" placeholder="Số CCCD (Ví dụ: 048...)" className="auth-input"
                        onChange={(e) => setFormData({ ...formData, cccd: e.target.value })} />

                    <input type="password" placeholder="Mật khẩu mới" className="auth-input" required
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })} />

                    <button type="submit" className="btn-secondary" style={{ width: '100%', height: '40px', fontSize: '1.2rem', marginTop: '10px' }}>
                        Đăng Ký
                    </button>
                </form>
                <div className="divider"></div>
                <span className="auth-footer-link" onClick={() => navigate('/login')}>
                    Bạn đã có tài khoản rồi?
                </span>
            </div>
        </div>
    );
}

export default Register;