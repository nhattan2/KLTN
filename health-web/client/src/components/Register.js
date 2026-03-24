import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import logoHealth from '../assets/logo-medicare.png';

function Register() {
    const [formData, setFormData] = useState({ username: '', email: '', phone: '', cccd: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSend = {};
        Object.keys(formData).forEach(key => { if (formData[key] !== "") dataToSend[key] = formData[key]; });
        
        axios.post('http://localhost:3001/register', dataToSend)
            .then(() => { alert("Đăng ký thành công!"); navigate('/login'); })
            .catch(() => alert("Thông tin đã tồn tại!"));
    };

    return (
        <div className="auth-container">
            <div className="auth-card" style={{maxWidth: '480px'}}>
                <div className="brand-wrapper">
                    <img src={logoHealth} alt="Logo" className="brand-icon-large" />
                    <h1 className="brand-name-large">MEDICARE</h1>
                </div>
                <h3>Tạo tài khoản</h3>
                <form onSubmit={handleSubmit} style={{marginTop: '1.5rem'}}>
                    <input className="auth-input" placeholder="Họ và tên" required onChange={e => setFormData({...formData, username: e.target.value})} />
                    <input className="auth-input" placeholder="Email" onChange={e => setFormData({...formData, email: e.target.value})} style={{marginTop: '10px'}}/>
                    <input className="auth-input" placeholder="Số điện thoại" onChange={e => setFormData({...formData, phone: e.target.value})} style={{marginTop: '10px'}}/>
                    <input className="auth-input" type="password" placeholder="Mật khẩu" required onChange={e => setFormData({...formData, password: e.target.value})} style={{marginTop: '10px'}}/>
                    <button type="submit" className="btn-secondary" style={{marginTop: '20px'}}>Đăng ký ngay</button>
                </form>
                <p style={{marginTop: '15px', fontSize: '0.9rem'}}>
                    Đã có tài khoản? <span onClick={() => navigate('/login')} style={{color: '#2563eb', cursor: 'pointer', fontWeight: '600'}}>Đăng nhập</span>
                </p>
            </div>
        </div>
    );
}
export default Register;