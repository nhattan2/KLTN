import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function CreateMedicalRecord() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'Tân';

  const [form, setForm] = useState({
    fullName: username,
    dob: '',
    gender: '',
    address: '',
    phone: '',
    email: '',
    cccd: '',
    medicalHistory: '',
    allergies: '',
    currentMedications: '',
    familyHistory: '',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.fullName || form.fullName.trim() === '') {
      setError('Vui lòng nhập họ và tên.');
      return false;
    }
    if (!form.phone && !form.email) {
      setError('Vui lòng cung cấp ít nhất Số điện thoại hoặc Email.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        username: localStorage.getItem('username') || username,
        ...form
      };
      const res = await axios.post('http://localhost:3001/api/create-medical-record', payload);
      if (res.data && res.data.success) {
        setSuccessMsg('Tạo hồ sơ bệnh án thành công!');
        setTimeout(() => navigate('/dashboard'), 1400);
      } else {
        setError(res.data.message || 'Không thể lưu hồ sơ. Vui lòng thử lại.');
      }
    } catch (err) {
      console.error(err);
      setError('Lỗi kết nối. Vui lòng kiểm tra và thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      fullName: username,
      dob: '',
      gender: '',
      address: '',
      phone: '',
      email: '',
      cccd: '',
      medicalHistory: '',
      allergies: '',
      currentMedications: '',
      familyHistory: '',
      notes: ''
    });
    setError(null);
    setSuccessMsg(null);
  };

  return (
    <div className="auth-container" style={{ background: '#f8fafc' }}>
      <div className="auth-card" style={{ maxWidth: 900 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ color: '#2563eb' }}>Tạo hồ sơ bệnh án</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-secondary" onClick={() => navigate('/dashboard')} style={{ background: '#94a3b8' }}>Hủy</button>
            <button className="btn-primary" onClick={handleSubmit} disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu hồ sơ'}</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontWeight: 600, color: '#64748b', marginBottom: 6 }}>Họ và tên</label>
            <input name="fullName" className="auth-input" value={form.fullName} onChange={handleChange} required />
          </div>

          <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontWeight: 600, color: '#64748b', marginBottom: 6 }}>Ngày sinh</label>
            <input name="dob" type="date" className="auth-input" value={form.dob} onChange={handleChange} />
          </div>

          <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontWeight: 600, color: '#64748b', marginBottom: 6 }}>Giới tính</label>
            <select name="gender" className="auth-input" value={form.gender} onChange={handleChange}>
              <option value="">Chọn giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontWeight: 600, color: '#64748b', marginBottom: 6 }}>Số điện thoại</label>
            <input name="phone" className="auth-input" value={form.phone} onChange={handleChange} />
          </div>

          <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontWeight: 600, color: '#64748b', marginBottom: 6 }}>Email</label>
            <input name="email" type="email" className="auth-input" value={form.email} onChange={handleChange} />
          </div>

          <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontWeight: 600, color: '#64748b', marginBottom: 6 }}>CCCD</label>
            <input name="cccd" className="auth-input" value={form.cccd} onChange={handleChange} />
          </div>

          <div style={{ gridColumn: '1 / -1', textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontWeight: 600, color: '#64748b', marginBottom: 6 }}>Địa chỉ</label>
            <input name="address" className="auth-input" value={form.address} onChange={handleChange} />
          </div>

          <div style={{ gridColumn: '1 / -1', textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontWeight: 600, color: '#64748b', marginBottom: 6 }}>Tiền sử bệnh (Medical history)</label>
            <textarea name="medicalHistory" rows="4" className="auth-input" style={{ resize: 'vertical' }} value={form.medicalHistory} onChange={handleChange} placeholder="Các bệnh mãn tính, phẫu thuật, ..." />
          </div>

          <div style={{ gridColumn: '1 / -1', textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontWeight: 600, color: '#64748b', marginBottom: 6 }}>Dị ứng</label>
            <textarea name="allergies" rows="2" className="auth-input" style={{ resize: 'vertical' }} value={form.allergies} onChange={handleChange} placeholder="Thuốc, thực phẩm, ..." />
          </div>

          <div style={{ gridColumn: '1 / -1', textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontWeight: 600, color: '#64748b', marginBottom: 6 }}>Thuốc đang sử dụng</label>
            <textarea name="currentMedications" rows="2" className="auth-input" style={{ resize: 'vertical' }} value={form.currentMedications} onChange={handleChange} placeholder="Liệt kê thuốc, liều lượng..." />
          </div>

          <div style={{ gridColumn: '1 / -1', textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontWeight: 600, color: '#64748b', marginBottom: 6 }}>Tiền sử gia đình</label>
            <textarea name="familyHistory" rows="2" className="auth-input" style={{ resize: 'vertical' }} value={form.familyHistory} onChange={handleChange} placeholder="Bệnh di truyền trong gia đình..." />
          </div>

          <div style={{ gridColumn: '1 / -1', textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontWeight: 600, color: '#64748b', marginBottom: 6 }}>Ghi chú thêm</label>
            <textarea name="notes" rows="3" className="auth-input" style={{ resize: 'vertical' }} value={form.notes} onChange={handleChange} placeholder="Thông tin khác (khuyến nghị từ bác sĩ, ...)" />
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="button" className="btn-secondary" onClick={handleReset} style={{ background: '#f1f5f9', color: '#64748b', height: 44 }}>Đặt lại</button>
            <button type="submit" className="btn-primary" disabled={loading} style={{ height: 44 }}>{loading ? 'Đang lưu...' : 'Lưu hồ sơ'}</button>
          </div>
        </form>

        {error && <p style={{ color: '#ef4444', marginTop: 12 }}>{error}</p>}
        {successMsg && <p style={{ color: '#10b981', marginTop: 12 }}>{successMsg}</p>}
      </div>
    </div>
  );
}

export default CreateMedicalRecord;