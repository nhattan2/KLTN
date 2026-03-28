import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../App.css';

function MyRecords() {
    const [record, setRecord] = useState(null);
    const username = localStorage.getItem("username");

    useEffect(() => {
        // Gọi API lấy hồ sơ chi tiết của đúng người dùng này
        axios.get(`http://localhost:3001/api/get-medical-record/${username}`)
            .then(res => setRecord(res.data))
            .catch(() => console.log("Chưa có hồ sơ"));
    }, [username]);

    if (!record) return <div className="auth-container"><h3>Bạn chưa tạo hồ sơ bệnh án nào!</h3></div>;

    return (
        <div className="auth-container" style={{ background: '#f8fafc' }}>
            <div className="auth-card" style={{ maxWidth: 800, textAlign: 'left' }}>
                <h2 style={{ color: '#2563eb', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>Hồ Sơ Bệnh Án Của Tôi</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                    <p><strong>Họ tên:</strong> {record.fullName}</p>
                    <p><strong>Ngày sinh:</strong> {record.dob}</p>
                    <p><strong>Giới tính:</strong> {record.gender}</p>
                    <p><strong>Số điện thoại:</strong> {record.phone}</p>
                </div>
                <hr />
                <p><strong>Tiền sử bệnh:</strong> {record.medicalHistory}</p>
                <p><strong>Dị ứng:</strong> {record.allergies}</p>
                <p><strong>Thuốc đang dùng:</strong> {record.currentMedications}</p>
                <p style={{ marginTop: '20px', color: '#64748b', fontSize: '0.8rem' }}>Ngày tạo: {new Date(record.createdAt).toLocaleString()}</p>
                <button className="btn-primary" onClick={() => window.history.back()} style={{ marginTop: '20px' }}>Quay lại</button>
            </div>
        </div>
    );
}

export default MyRecords;