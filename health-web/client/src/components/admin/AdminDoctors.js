import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../App.css';
import { useNavigate } from 'react-router-dom';

function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchDoctors = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:3001/api/admin/doctors');
      // backend có thể trả mảng trực tiếp hoặc { success: true, data: [...] }
      const data = Array.isArray(res.data) ? res.data : (res.data.data || res.data);
      // Chỉ lấy những user có role 'doctor' đề phòng backend trả cả users
      const onlyDoctors = (data || []).filter(u => u.role === 'doctor');
      setDoctors(onlyDoctors);
    } catch (err) {
      console.error(err);
      setError('Không thể tải danh sách bác sĩ. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const toggleActive = async (id, currentActive) => {
    try {
      await axios.patch(`http://localhost:3001/api/admin/doctors/${id}/toggle-active`, { active: !currentActive });
      setDoctors(prev => prev.map(d => d._id === id ? { ...d, active: !currentActive } : d));
    } catch (err) {
      console.error(err);
      alert('Lỗi khi cập nhật trạng thái bác sĩ.');
    }
  };

  return (
    <div className="auth-container" style={{ alignItems: 'flex-start', paddingTop: 40 }}>
      <div className="auth-card" style={{ maxWidth: 1000, width: '95%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ color: '#d97706' }}>Quản lý Bác sĩ</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-secondary" onClick={() => navigate('/admin/create-doctor')} style={{ background: '#d97706' }}>
              Tạo bác sĩ
            </button>
            <button className="btn-primary" onClick={fetchDoctors}>
              Tải lại
            </button>
          </div>
        </div>

        {loading ? (
          <p>Đang tải danh sách...</p>
        ) : error ? (
          <p style={{ color: '#ef4444' }}>{error}</p>
        ) : (
          <div style={{ overflowX: 'auto', marginTop: 12 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                  <th style={{ padding: 12 }}>Họ tên</th>
                  <th>Email</th>
                  <th>Chuyên khoa</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {doctors.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: 12 }}>Không tìm thấy bác sĩ.</td>
                  </tr>
                ) : doctors.map(doc => (
                  <tr key={doc._id} style={{ borderBottom: '1px solid #eef2ff' }}>
                    <td style={{ padding: 12 }}>{doc.username || '-'}</td>
                    <td>{doc.email || '-'}</td>
                    <td>{doc.specialization || '-'}</td>
                    <td>{doc.active ? <span style={{ color: '#10b981' }}>Hoạt động</span> : <span style={{ color: '#ef4444' }}>Khóa</span>}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          className="btn-primary"
                          onClick={() => toggleActive(doc._id, !!doc.active)}
                          style={{ background: doc.active ? '#f97316' : '#10b981', padding: '6px 10px', height: 36 }}
                        >
                          {doc.active ? 'Khóa' : 'Kích hoạt'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDoctors;