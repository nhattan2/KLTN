import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
    const [formData, setFormData] = useState({ username: '', email: '', phone: '', cccd: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Lọc bỏ các trường rỗng trước khi gửi
        const dataToSend = {};
        Object.keys(formData).forEach(key => {
            if (formData[key].trim() !== "") dataToSend[key] = formData[key];
        });

        if (Object.keys(dataToSend).length < 3) { // Phải có tên, mật khẩu và ít nhất 1 thông tin định danh
            alert("Vui lòng nhập đầy đủ thông tin định danh!"); return;
        }

        axios.post('http://localhost:3001/register', dataToSend)
            .then(() => { alert("Đăng ký thành công!"); navigate('/login'); })
            .catch(() => alert("Thông tin này đã được sử dụng!"));
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Tạo tài khoản</h2>
                <form onSubmit={handleSubmit}>
                    <input className="auth-input" placeholder="Họ tên" onChange={e => setFormData({ ...formData, username: e.target.value })} required />
                    <input className="auth-input" placeholder="Email" onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    <input className="auth-input" placeholder="SĐT" onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                    <input className="auth-input" placeholder="CCCD" onChange={e => setFormData({ ...formData, cccd: e.target.value })} />
                    <input className="auth-input" type="password" placeholder="Mật khẩu" onChange={e => setFormData({ ...formData, password: e.target.value })} required />
                    <button type="submit" className="btn-secondary" style={{ width: '100%', height: '52px' }}>Đăng Ký</button>
                </form>
            </div>
        </div>
    );
}
export default Register;