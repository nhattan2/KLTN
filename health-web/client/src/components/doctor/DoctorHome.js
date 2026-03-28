function DoctorHome() {
    return (
        <div className="doctor-dashboard">
            <div className="stats-grid">
                <div className="dashboard-stat-card">
                    <h3>📅 Lịch hẹn mới</h3>
                    <div style={{ fontSize: '2rem', color: '#2563eb' }}>05</div>
                </div>
                <div className="dashboard-stat-card">
                    <h3>✅ Đã hoàn thành</h3>
                    <div style={{ fontSize: '2rem', color: '#10b981' }}>12</div>
                </div>
            </div>

            <h3 style={{ marginTop: '2rem' }}>Danh sách bệnh nhân chờ khám:</h3>
            <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                        <th style={{ padding: '12px' }}>Bệnh nhân</th>
                        <th>Giờ hẹn</th>
                        <th>Tình trạng</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ padding: '12px' }}>Nguyễn Văn A</td>
                        <td>08:30 AM</td>
                        <td><span style={{ color: '#f59e0b' }}>Đang chờ</span></td>
                        <td><button className="btn-add">Xem hồ sơ</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );

}
export default DoctorHome;