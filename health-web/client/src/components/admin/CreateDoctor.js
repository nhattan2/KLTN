import React, { useState } from 'react';
import axios from 'axios';
import '../../App.css';

function CreateDoctor() {
    const [form, setForm] = useState({ username: '', email: '', password: '', specialization: '' });

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            // Gửi kèm role 'doctor' mặc định
            await axios.post('http://localhost:3001/register', { ...form, role: 'doctor' });
            alert("Đã cấp tài khoản Bác sĩ thành công! 🎉");
        } catch (err) {
            alert("Lỗi rồi bạn ơi, kiểm tra lại nhé!");
        }
    };

    return (
        <div className="auth-card" style={{ maxWidth: '500px', margin: '2rem auto' }}>
            <h2 style={{ color: '#d97706' }}>➕ Cấp Tài Khoản Bác Sĩ</h2>
            <form onSubmit={handleCreate} style={{ textAlign: 'left', marginTop: '1rem' }}>
                <label>Họ và tên Bác sĩ:</label>
                <input className="auth-input" onChange={e => setForm({ ...form, username: e.target.value })} required />
                <label>Chuyên khoa (VD: Nội tiết, Tim mạch):</label>
                <input className="auth-input" onChange={e => setForm({ ...form, specialization: e.target.value })} required />
                <label>Email đăng nhập:</label>
                <input className="auth-input" type="email" onChange={e => setForm({ ...form, email: e.target.value })} required />
                <label>Mật khẩu tạm thời:</label>
                <input className="auth-input" type="password" onChange={e => setForm({ ...form, password: e.target.value })} required />
                <button type="submit" className="btn-primary" style={{ background: '#d97706', marginTop: '1rem' }}>Tạo tài khoản</button>
            </form>
        </div>
    );
}
export default CreateDoctor;