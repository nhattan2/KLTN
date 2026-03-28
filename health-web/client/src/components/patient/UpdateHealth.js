import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const getAdvice = (status) => {
    if (status.includes("Cao")) {
        return {
            instruction: "Hãy nghỉ ngơi, hít thở sâu, uống một cốc nước ấm. Tránh xúc động mạnh.",
            color: "#ef4444",
            bgColor: "#fee2e2",
            borderColor: "#f59e0b"
        };
    }
    if (status.includes("Thấp")) {
        return {
            instruction: "Hãy nằm nghỉ, kê chân cao, uống ngay một cốc nước đường hoặc gừng ấm.",
            color: "#0369a1",
            bgColor: "#e0f2fe",
            borderColor: "#3b82f6"
        };
    }
    return {
        instruction: "Chỉ số đẹp! Hãy tiếp tục duy trì lối sống lành mạnh và tập luyện điều độ nhé!",
        color: "#10b981",
        bgColor: "#f0fdf4",
        borderColor: "#4ade80"
    };
};

function UpdateHealth() {
    const [form, setForm] = useState({ heartRate: '', bloodPressure: '', bloodSugar: '' });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        const username = localStorage.getItem('username') || "Tân";

        try {
            const res = await axios.post('http://localhost:3001/api/update-health', {
                ...form,
                username: username
            });
            setResult(res.data.data);
        } catch (err) {
            alert("⚠️ Lỗi kết nối Server rồi Tân ơi!");
        }
        setLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-card" style={{ maxWidth: '500px' }}>
                <h2 style={{ color: '#2563eb', marginBottom: '1.5rem' }}>🩺 Phân tích Chỉ số</h2>

                <form onSubmit={handleSave} style={{ textAlign: 'left' }}>
                    <div className="auth-input-group">
                        <label style={{ fontWeight: '600', color: '#64748b' }}>Nhịp tim (bpm):</label>
                        <input type="number" className="auth-input" placeholder="VD: 75"
                            onChange={(e) => setForm({ ...form, heartRate: e.target.value })} required />
                    </div>

                    <div className="auth-input-group">
                        <label style={{ fontWeight: '600', color: '#64748b' }}>Huyết áp (tâm thu/tâm trương):</label>
                        <input type="text" className="auth-input" placeholder="VD: 120/80"
                            onChange={(e) => setForm({ ...form, bloodPressure: e.target.value })} required />
                    </div>

                    <div className="auth-input-group">
                        <label style={{ fontWeight: '600', color: '#64748b' }}>Đường huyết (mg/dL):</label>
                        <input type="number" className="auth-input" placeholder="VD: 95"
                            onChange={(e) => setForm({ ...form, bloodSugar: e.target.value })} required />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? "Đang phân tích..." : "Phân tích ngay"}
                    </button>
                </form>

                {/* KHỐI KẾT QUẢ DUY NHẤT - GỌN GÀNG & THÔNG MINH */}
                {result && (
                    <div className="result-container" style={{
                        marginTop: '20px', padding: '20px', borderRadius: '16px',
                        background: '#ffffff', border: '1px solid #e2e8f0',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.03)', textAlign: 'left'
                    }}>
                        <h4 style={{ color: '#1e293b', marginBottom: '10px' }}>Kết quả phân tích:</h4>

                        <div style={{
                            padding: '10px 15px', borderRadius: '10px', display: 'inline-block',
                            background: getAdvice(result.status).bgColor,
                            color: getAdvice(result.status).color,
                            fontWeight: '800', marginBottom: '15px'
                        }}>
                            Tình trạng: {result.status}
                        </div>

                        <div style={{
                            padding: '15px', borderRadius: '12px', background: '#f8fafc',
                            borderLeft: `5px solid ${getAdvice(result.status).borderColor}`,
                            marginBottom: '15px'
                        }}>
                            <h5 style={{ color: '#64748b', marginBottom: '5px' }}>Hướng dẫn xử lý:</h5>
                            <p style={{ color: '#1e293b', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                {getAdvice(result.status).instruction}
                            </p>
                        </div>

                        <button
                            className="btn-primary"
                            style={{
                                marginTop: '10px', background: '#1e40af', width: '100%',
                                height: '48px', fontSize: '1.05rem', fontWeight: '700'
                            }}
                            onClick={() => {
                                const username = localStorage.getItem('username') || "Tân";
                                const autoQuestion = `Tôi là ${username}. Chỉ số vừa nhập: Nhịp tim ${form.heartRate} bpm, Huyết áp ${form.bloodPressure}, Đường huyết ${form.bloodSugar} mg/dL. Tình trạng: ${result.status}. Hãy tư vấn chi tiết cách chăm sóc sức khỏe cho tôi.`;
                                navigate('/ai-consult', { state: { initialMsg: autoQuestion } });
                            }}
                        >
                            Hỏi AI chi tiết hơn
                        </button>

                        <button className="btn-secondary" style={{ marginTop: '10px', height: '40px', background: '#f1f5f9', color: '#64748b' }}
                            onClick={() => navigate('/dashboard')}>
                            Về Trang Chủ
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UpdateHealth;