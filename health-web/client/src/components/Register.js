import React, { useState } from 'react';

function Register() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });

    const handleSubmit = (e) => {
        e.envDefault();
        console.log("Dữ liệu đăng ký:", formData);
        // Sau này sẽ gọi API NodeJS ở đây
    };

    return (
        <div style={{ padding: '50px', maxWidth: '400px', margin: 'auto' }}>
            <h2>Đăng Ký Tài Khoản Y Tế</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Họ tên" onChange={(e) => setFormData({ ...formData, username: e.target.value })} style={styles.input} />
                <input type="email" placeholder="Email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={styles.input} />
                <input type="password" placeholder="Mật khẩu" onChange={(e) => setFormData({ ...formData, password: e.target.value })} style={styles.input} />
                <button type="submit" style={styles.button}>Đăng Ký</button>
            </form>
        </div>
    );
}

const styles = {
    input: { width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc' },
    button: { width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }
};

export default Register;