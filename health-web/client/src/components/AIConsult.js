import React, { useState, useEffect } from 'react'; // Phải thêm useEffect ở đây
import { useNavigate, useLocation } from 'react-router-dom'; // Phải thêm useLocation ở đây
import axios from 'axios';
import '../App.css';

function AIConsult() {
    const [input, setInput] = useState('');
    const [chatLog, setChatLog] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation(); // Đặt useLocation bên trong function

    // Tự động nhận tin nhắn từ trang UpdateHealth
    useEffect(() => {
        if (location.state && location.state.initialMsg) {
            const autoMsg = location.state.initialMsg;
            setInput(autoMsg); // Điền tin nhắn vào ô nhập

            // Xóa state để không bị lặp lại khi F5
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const handleSend = async () => {
        const messageToSend = input.trim();
        if (!messageToSend) return;

        setLoading(true);
        const userMsg = { role: 'user', text: messageToSend };
        const updatedChatLog = [...chatLog, userMsg];
        setChatLog(updatedChatLog);
        setInput('');

        try {
            const res = await axios.post('http://localhost:3001/api/ai-consult', { history: updatedChatLog });
            setChatLog(prev => [...prev, { role: 'ai', text: res.data.reply }]);
        } catch (err) {
            setChatLog(prev => [...prev, { role: 'ai', text: "Lỗi kết nối server!" }]);
        }
        setLoading(false);
    };

    // ... Giữ nguyên các hàm handleChange và handleKeyDown cũ của con ...
    const handleChange = (e) => { setInput(e.target.value); };
    const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.ctrlKey) { e.preventDefault(); handleSend(); } };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#e2f1f9ff' }}>
            <header style={{ backgroundColor: '#2563eb', color: 'white', padding: '15px 20px', display: 'flex', alignItems: 'center' }}>
                <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>Quay lại</button>
                <h2 style={{ margin: '0 auto', fontSize: '1.2rem' }}>Trợ lý MediCare</h2>
            </header>

            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {chatLog.map((chat, i) => (
                        <div key={i} style={{ alignSelf: chat.role === 'user' ? 'flex-end' : 'flex-start', background: chat.role === 'user' ? '#2563eb' : '#fff', color: chat.role === 'user' ? '#fff' : '#000', padding: '10px 15px', borderRadius: '15px', maxWidth: '70%' }}>
                            {chat.text}
                        </div>
                    ))}
                    {loading && <p style={{ color: '#64748b', fontStyle: 'italic' }}>Bác sĩ đang soạn câu trả lời...</p>}
                </div>
            </div>

            <div style={{ backgroundColor: 'white', padding: '15px', display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '100%', maxWidth: '800px', display: 'flex', gap: '10px' }}>
                    <textarea className="auth-input" style={{ flex: 1, borderRadius: '20px', padding: '10px' }} value={input} placeholder="Mô tả triệu chứng..." onChange={handleChange} onKeyDown={handleKeyDown} />
                    <button className="btn-primary" style={{ width: '80px', borderRadius: '20px' }} onClick={handleSend}>Gửi</button>
                </div>
            </div>
        </div>
    );
}

export default AIConsult;