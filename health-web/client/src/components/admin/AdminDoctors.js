import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../App.css';
import { useNavigate } from 'react-router-dom';

function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Lấy danh sách bác sĩ từ backend
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:3001/api/admin/doctors');
      // mong backend trả về { success: true, data: [...] } hoặc mảng trực tiếp
      const list = res.data && res.data.data ? res.data.data : res.data;
      setDoctors(list || []);
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

  // Toggle trạng thái active (khóa / kích hoạt)
  const handleToggleActive = async (doctorId, currentActive) => {
    try {
      // Gọi backend để cập nhật trạng thái tài khoản
      await axios.patch(`http://localhost:3001/api/admin/doctors/${doctorId}/toggle-active`, {
        active: !currentActive
      });
      // Cập nhật nhanh ở client
      setDoctors(prev => prev.map(d => (d._id === doctorId ? { ...d, active: !currentActive } : d)));
    } catch (err) {
      console.error(err);
      alert('Lỗi khi cập nhật trạng thái. Vui lòng thử lại.');
    }
  };

  // Xóa bác sĩ (tuỳ chọn)
  const handleDelete = async (doctorId) => {
    if (!window.confirm('Bạn có chắc muốn xóa tài khoản bác sĩ này? Hành động không thể hoàn tác.')) return;
    try {
      await axios.delete(`http://localhost:3001/api/admin/doctors/${doctorId}`);
      setDoctors(prev => prev.filter(d => d._id !== doctorId));
    } catch (err) {
      console.error(err);
      alert('Xóa thất bại. Thử lại.');
    }
  };

  const filtered = doctors.filter(d => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (d.username && d.username.toLowerCase().includes(q)) ||
           (d.email && d.email.toLowerCase().includes(q)) ||
           (d.specialization && d.specialization.toLowerCase().includes(q));
  });

  return (
    <div className="auth-container" style={{ alignItems: 'flex-start', paddingTop: 40 }}>
      <div className="auth-card" style={{ maxWidth: 1000, width: '95%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ color: '#d97706' }}>Quản lý Bác sĩ (Admin)</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-secondary" onClick={() => navigate('/admin/create-doctor')} style={{ background: '#d97706' }}>
              Tạo bác sĩ mới
            </button>
            <button className="btn-primary" onClick={fetchDoctors} style={{ background: '#2563eb' }}>
              Tải lại
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
          <input className="auth-input" placeholder="Tìm theo tên, email, chuyên khoa..." value={query} onChange={e => setQuery(e.target.value)} />
          <button className="btn-primary" onClick={() => setQuery('')} style={{ width: 120 }}>Xóa</button>
        </div>

        {loading ? (
          <p>Đang tải danh sách bác sĩ...</p>
        ) : error ? (
          <p style={{ color: '#ef4444' }}>{error}</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', background: '#f8fafc' }}>
                  <th style={{ padding: 12 }}>Họ tên</th>
                  <th>Email</th>
                  <th>Chuyên khoa</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="6" style={{ padding: 12 }}>Không tìm thấy bác sĩ nào.</td></tr>
                ) : filtered.map(doc => (
                  <tr key={doc._id} style={{ borderBottom: '1px solid #eef2ff' }}>
                    <td style={{ padding: 12 }}>{doc.username}</td>
                    <td>{doc.email}</td>
                    <td>{doc.specialization || '-'}</td>
                    <td>
                      {doc.active ? <span style={{ color: '#10b981' }}>Hoạt động</span> : <span style={{ color: '#ef4444' }}>Bị khoá</span>}
                    </td>
                    <td>{doc.createdAt ? new Date(doc.createdAt).toLocaleString() : '-'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          className="btn-primary"
                          onClick={() => handleToggleActive(doc._id, doc.active)}
                          style={{
                            background: doc.active ? '#f97316' : '#10b981',
                            padding: '6px 10px',
                            height: '36px'
                          }}
                        >
                          {doc.active ? 'Khóa' : 'Kích hoạt'}
                        </button>

                        <button
                          className="btn-secondary"
                          onClick={() => navigate(`/admin/doctor/${doc._id}`)}
                          style={{ background: '#94a3b8', padding: '6px 10px', height: '36px' }}
                        >
                          Xem
                        </button>

                        <button
                          className="btn-add"
                          onClick={() => handleDelete(doc._id)}
                          style={{ background: '#ef4444', padding: '6px 10px', height: '36px' }}
                        >
                          Xóa
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