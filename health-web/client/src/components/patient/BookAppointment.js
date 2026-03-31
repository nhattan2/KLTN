import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function BookAppointment() {
    const navigate = useNavigate();
    const username = localStorage.getItem("username") || "Người dùng";

    const [services, setServices] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [appointmentDate, setAppointmentDate] = useState('');
    const [timeSlot, setTimeSlot] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('online');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Chọn DV, 2: Chọn BS & giờ, 3: Xác nhận
    const [result, setResult] = useState(null);

    const timeSlots = [
        "08:00 - 08:30", "08:30 - 09:00", "09:00 - 09:30", "09:30 - 10:00",
        "10:00 - 10:30", "10:30 - 11:00", "13:30 - 14:00", "14:00 - 14:30",
        "14:30 - 15:00", "15:00 - 15:30", "15:30 - 16:00", "16:00 - 16:30"
    ];

    useEffect(() => {
        axios.get('http://localhost:3001/api/services').then(res => setServices(res.data)).catch(() => {});
        axios.get('http://localhost:3001/api/doctors-available').then(res => setDoctors(res.data)).catch(() => {});
    }, []);

    const formatVND = (num) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
    };

    const handleBooking = async () => {
        if (!selectedService || !appointmentDate || !timeSlot) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:3001/api/book-appointment', {
                patientUsername: username,
                doctorId: selectedDoctor?._id || 'auto',
                doctorName: selectedDoctor?.username || 'Hệ thống phân công',
                serviceId: selectedService._id,
                serviceName: selectedService.name,
                servicePrice: selectedService.price,
                appointmentDate,
                timeSlot,
                paymentMethod
            });
            setResult(res.data);
            setStep(4); // Bước kết quả
        } catch (err) {
            alert("❌ Đặt lịch thất bại. Vui lòng thử lại!");
        }
        setLoading(false);
    };

    // Lấy ngày tối thiểu (ngày mai)
    const getMinDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    return (
        <div className="auth-container">
            <div className="auth-card" style={{ maxWidth: '620px', textAlign: 'left' }}>

                {/* HEADER */}
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ color: '#2563eb', marginBottom: '0.5rem' }}>📋 Đặt lịch khám bệnh</h2>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Chọn dịch vụ, bác sĩ và thanh toán nhanh chóng</p>
                </div>

                {/* PROGRESS BAR */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '2rem' }}>
                    {[1, 2, 3].map(s => (
                        <div key={s} style={{
                            flex: 1, height: '4px', borderRadius: '4px',
                            background: step >= s ? '#2563eb' : '#e2e8f0',
                            transition: 'all 0.3s'
                        }} />
                    ))}
                </div>

                {/* === STEP 1: CHỌN DỊCH VỤ === */}
                {step === 1 && (
                    <div>
                        <h3 style={{ color: '#1e293b', marginBottom: '1rem' }}>Bước 1: Chọn dịch vụ khám</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {services.map(service => (
                                <div key={service._id} onClick={() => setSelectedService(service)}
                                    style={{
                                        padding: '16px', borderRadius: '14px', cursor: 'pointer',
                                        border: selectedService?._id === service._id ? '2px solid #2563eb' : '1.5px solid #e2e8f0',
                                        background: selectedService?._id === service._id ? '#eff6ff' : 'white',
                                        transition: 'all 0.2s'
                                    }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '1rem' }}>{service.name}</div>
                                            <div style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '4px' }}>{service.description}</div>
                                        </div>
                                        <div style={{
                                            fontWeight: '800', color: '#2563eb', fontSize: '1.1rem',
                                            background: '#eff6ff', padding: '6px 14px', borderRadius: '10px',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {formatVND(service.price)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="btn-primary" style={{ marginTop: '1.5rem' }}
                            onClick={() => selectedService && setStep(2)}
                            disabled={!selectedService}>
                            Tiếp tục →
                        </button>
                    </div>
                )}

                {/* === STEP 2: CHỌN BÁC SĨ & THỜI GIAN === */}
                {step === 2 && (
                    <div>
                        <h3 style={{ color: '#1e293b', marginBottom: '1rem' }}>Bước 2: Chọn bác sĩ & thời gian</h3>

                        {/* Chọn bác sĩ */}
                        <label style={{ fontWeight: '600', color: '#475569', display: 'block', marginBottom: '8px' }}>Bác sĩ phụ trách (tùy chọn):</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.2rem' }}>
                            {doctors.length === 0 && (
                                <div style={{ padding: '12px 16px', borderRadius: '12px', background: '#f0fdf4', border: '1.5px solid #bbf7d0' }}>
                                    <span style={{ color: '#10b981', fontWeight: '600', fontSize: '0.9rem' }}>🏥 Hệ thống sẽ tự động phân công bác sĩ cho bạn</span>
                                </div>
                            )}
                            {doctors.map(doc => (
                                <div key={doc._id} onClick={() => setSelectedDoctor(doc)}
                                    style={{
                                        padding: '12px 16px', borderRadius: '12px', cursor: 'pointer',
                                        border: selectedDoctor?._id === doc._id ? '2px solid #10b981' : '1.5px solid #e2e8f0',
                                        background: selectedDoctor?._id === doc._id ? '#f0fdf4' : 'white',
                                        display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s'
                                    }}>
                                    <div style={{
                                        width: '40px', height: '40px', borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #10b981, #059669)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'white', fontWeight: '700', fontSize: '1.1rem'
                                    }}>
                                        {doc.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '700', color: '#1e293b' }}>BS. {doc.username}</div>
                                        <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{doc.specialization || 'Đa khoa'}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Chọn ngày */}
                        <label style={{ fontWeight: '600', color: '#475569', display: 'block', marginBottom: '8px' }}>Ngày khám:</label>
                        <input type="date" className="auth-input" min={getMinDate()}
                            value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)}
                            style={{ marginBottom: '1.2rem' }} />

                        {/* Chọn giờ */}
                        <label style={{ fontWeight: '600', color: '#475569', display: 'block', marginBottom: '8px' }}>Khung giờ:</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '1.2rem' }}>
                            {timeSlots.map(slot => (
                                <div key={slot} onClick={() => setTimeSlot(slot)}
                                    style={{
                                        padding: '10px', borderRadius: '10px', textAlign: 'center',
                                        cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem',
                                        border: timeSlot === slot ? '2px solid #2563eb' : '1.5px solid #e2e8f0',
                                        background: timeSlot === slot ? '#eff6ff' : 'white',
                                        color: timeSlot === slot ? '#2563eb' : '#64748b',
                                        transition: 'all 0.2s'
                                    }}>
                                    {slot}
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button className="btn-secondary" style={{ background: '#f1f5f9', color: '#64748b' }}
                                onClick={() => setStep(1)}>← Quay lại</button>
                            <button className="btn-primary"
                                onClick={() => appointmentDate && timeSlot && setStep(3)}
                                disabled={!appointmentDate || !timeSlot}>
                                Tiếp tục →
                            </button>
                        </div>
                    </div>
                )}

                {/* === STEP 3: XÁC NHẬN & THANH TOÁN === */}
                {step === 3 && (
                    <div>
                        <h3 style={{ color: '#1e293b', marginBottom: '1rem' }}>Bước 3: Xác nhận & Thanh toán</h3>

                        {/* Bảng tóm tắt */}
                        <div style={{
                            background: '#f8fafc', borderRadius: '16px', padding: '20px',
                            border: '1px solid #e2e8f0', marginBottom: '1.5rem'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <span style={{ color: '#64748b' }}>Dịch vụ:</span>
                                <span style={{ fontWeight: '700', color: '#1e293b' }}>{selectedService?.name}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <span style={{ color: '#64748b' }}>Bác sĩ:</span>
                                <span style={{ fontWeight: '700', color: '#1e293b' }}>{selectedDoctor ? `BS. ${selectedDoctor.username}` : '🏥 Hệ thống phân công'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <span style={{ color: '#64748b' }}>Ngày khám:</span>
                                <span style={{ fontWeight: '700', color: '#1e293b' }}>{appointmentDate}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <span style={{ color: '#64748b' }}>Giờ khám:</span>
                                <span style={{ fontWeight: '700', color: '#1e293b' }}>{timeSlot}</span>
                            </div>
                            <hr style={{ border: 'none', borderTop: '2px dashed #e2e8f0', margin: '12px 0' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: '700', color: '#1e293b', fontSize: '1.05rem' }}>Tổng thanh toán:</span>
                                <span style={{ fontWeight: '800', color: '#2563eb', fontSize: '1.3rem' }}>{formatVND(selectedService?.price)}</span>
                            </div>
                        </div>

                        {/* Chọn phương thức thanh toán */}
                        <label style={{ fontWeight: '600', color: '#475569', display: 'block', marginBottom: '10px' }}>Phương thức thanh toán:</label>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
                            <div onClick={() => setPaymentMethod('online')} style={{
                                flex: 1, padding: '14px', borderRadius: '12px', textAlign: 'center',
                                cursor: 'pointer', fontWeight: '700', fontSize: '0.9rem',
                                border: paymentMethod === 'online' ? '2px solid #2563eb' : '1.5px solid #e2e8f0',
                                background: paymentMethod === 'online' ? '#eff6ff' : 'white',
                                color: paymentMethod === 'online' ? '#2563eb' : '#64748b'
                            }}>
                                💳 Thanh toán Online
                            </div>
                            <div onClick={() => setPaymentMethod('cash')} style={{
                                flex: 1, padding: '14px', borderRadius: '12px', textAlign: 'center',
                                cursor: 'pointer', fontWeight: '700', fontSize: '0.9rem',
                                border: paymentMethod === 'cash' ? '2px solid #10b981' : '1.5px solid #e2e8f0',
                                background: paymentMethod === 'cash' ? '#f0fdf4' : 'white',
                                color: paymentMethod === 'cash' ? '#10b981' : '#64748b'
                            }}>
                                💵 Tiền mặt
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button className="btn-secondary" style={{ background: '#f1f5f9', color: '#64748b' }}
                                onClick={() => setStep(2)}>← Quay lại</button>
                            <button className="btn-primary" onClick={handleBooking} disabled={loading}
                                style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}>
                                {loading ? "⏳ Đang xử lý..." : "✅ Xác nhận thanh toán"}
                            </button>
                        </div>
                    </div>
                )}

                {/* === STEP 4: KẾT QUẢ === */}
                {step === 4 && result && (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '80px', height: '80px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 1rem', fontSize: '2.5rem'
                        }}>✅</div>

                        <h2 style={{ color: '#10b981', marginBottom: '0.5rem' }}>Thanh toán thành công!</h2>
                        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Lịch hẹn của bạn đã được xác nhận</p>

                        <div style={{
                            background: '#f0fdf4', borderRadius: '16px', padding: '20px',
                            border: '1px solid #bbf7d0', textAlign: 'left', marginBottom: '1.5rem'
                        }}>
                            <div style={{ marginBottom: '8px' }}>
                                <span style={{ color: '#64748b' }}>Mã giao dịch: </span>
                                <span style={{ fontWeight: '700', color: '#1e293b', fontFamily: 'monospace' }}>{result.payment?.transactionId}</span>
                            </div>
                            <div style={{ marginBottom: '8px' }}>
                                <span style={{ color: '#64748b' }}>Số tiền: </span>
                                <span style={{ fontWeight: '700', color: '#10b981' }}>{formatVND(result.payment?.amount)}</span>
                            </div>
                            <div>
                                <span style={{ color: '#64748b' }}>Trạng thái: </span>
                                <span style={{ fontWeight: '700', color: '#10b981' }}>✅ Thành công</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button className="btn-primary" style={{ background: '#2563eb' }}
                                onClick={() => navigate('/payment/history')}>
                                📜 Xem lịch sử
                            </button>
                            <button className="btn-secondary" style={{ background: '#f1f5f9', color: '#64748b' }}
                                onClick={() => navigate('/dashboard')}>
                                🏠 Về trang chủ
                            </button>
                        </div>
                    </div>
                )}

                {/* Nút về dashboard (luôn hiển thị ở step 1-3) */}
                {step < 4 && (
                    <button style={{
                        marginTop: '1rem', background: 'none', border: 'none',
                        color: '#94a3b8', cursor: 'pointer', fontSize: '0.85rem', width: '100%'
                    }} onClick={() => navigate('/dashboard')}>
                        ← Quay về Dashboard
                    </button>
                )}
            </div>
        </div>
    );
}

export default BookAppointment;
