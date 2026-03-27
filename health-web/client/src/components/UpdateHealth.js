import React, { useState } from 'react';
import axios from 'axios';

function UpdateHealth() {
    const [form, setForm] = useState({ heartRate: '', bloodPressure: '', bloodSugar: '' });

    const handleSave = async (e) => {
        e.preventDefault();
        const username = localStorage.getItem('username'); // Phải lấy đúng tên đã login

        try {
            const res = await axios.post('http://localhost:3001/api/update-health', {
                ...form,
                username: username
            });
            alert(`Trạng thái: ${res.data.data.status}`); //
        } catch (err) {
            alert("Kiểm tra lại Server"); //
        }
    };

    return (
        <div className="dashboard-container" style={{ padding: '2rem' }}>
            <div className="auth-card" style={{ maxWidth: '450px', margin: '0 auto' }}>
                <h2 style={{ color: '#2563eb' }}>🩺 Cập nhật Chỉ số</h2>
                <form onSubmit={handleSave} style={{ textAlign: 'left' }}>
                    <label>Nhịp tim (bpm):</label>
                    <input type="number" className="auth-input" placeholder="VD: 75"
                        onChange={(e) => setForm({ ...form, heartRate: e.target.value })} required />

                    <label>Huyết áp (systolic/diastolic):</label>
                    <input type="text" className="auth-input" placeholder="VD: 120/80"
                        onChange={(e) => setForm({ ...form, bloodPressure: e.target.value })} required />

                    <label>Đường huyết (mg/dL):</label>
                    <input type="number" className="auth-input" placeholder="VD: 95"
                        onChange={(e) => setForm({ ...form, bloodSugar: e.target.value })} required />

                    <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>Lưu và Phân tích</button>
                </form>
            </div>
        </div>
    );
}

export default UpdateHealth;