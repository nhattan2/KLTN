import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function AIConsult() {
    const [input, setInput] = useState('');
    const [chatLog, setChatLog] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSend = async () => {
        if (!input.trim()) return;
        setLoading(true);
        const userMsg = { role: 'user', text: input };

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

    // Xử lý sự kiện gõ chữ để tự động xuống dòng khi gặp dấu chấm
    const handleChange = (e) => {
        let val = e.target.value;
        const cursorPosition = e.target.selectionStart;

        // Tự động xuống dòng khi vừa nhập dấu chấm (.)
        if (val.length > input.length && val[cursorPosition - 1] === '.') {
            val = val.slice(0, cursorPosition) + '\n' + val.slice(cursorPosition);
            setInput(val);

            // Cập nhật lại vị trí con trỏ sau khi React render xong
            setTimeout(() => {
                if (e.target) {
                    e.target.selectionStart = cursorPosition + 1;
                    e.target.selectionEnd = cursorPosition + 1;
                }
            }, 0);
        } else {
            setInput(val);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (e.ctrlKey) {
                // Nhấn Ctrl + Enter để xuống dòng
                e.preventDefault();
                const cursorPosition = e.target.selectionStart;
                const newValue = input.slice(0, cursorPosition) + '\n' + input.slice(cursorPosition);
                setInput(newValue);
                setTimeout(() => {
                    if (e.target) {
                        e.target.selectionStart = cursorPosition + 1;
                        e.target.selectionEnd = cursorPosition + 1;
                    }
                }, 0);
            } else {
                // Enter bình thường để Gửi
                e.preventDefault();
                handleSend();
            }
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#e2f1f9ff' }}>
            {/* Thanh tiêu đề Header */}
            <header style={{ backgroundColor: '#2563eb', color: 'white', padding: '15px 20px', display: 'flex', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                    <span style={{ fontSize: '1.2rem', marginRight: '5px' }}></span> Quay lại
                </button>
                <h2 style={{ margin: '0 auto', fontSize: '1.2rem', fontWeight: '600', paddingRight: '60px' }}>Trợ lý MediCare</h2>
            </header>

            {/* Khung chứa tin nhắn chat */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {chatLog.map((chat, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: chat.role === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: '10px' }}>
                            {/* Avatar Bác sĩ AI */}
                            {chat.role === 'ai' && (
                                <div style={{ width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#ffffffff', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem', flexShrink: 0, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                    👨‍⚕️
                                </div>
                            )}

                            <div style={{
                                maxWidth: '75%',
                                padding: '12px 18px',
                                borderRadius: chat.role === 'user' ? '18px 18px 0px 18px' : '18px 18px 18px 0px',
                                background: chat.role === 'user' ? '#2563eb' : '#ffffff',
                                color: chat.role === 'user' ? 'white' : '#1e293b',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                whiteSpace: 'pre-wrap',
                                lineHeight: '1.6',
                                fontSize: '1rem',
                                border: chat.role === 'ai' ? '1px solid #e2e8f0' : 'none'
                            }}>
                                {chat.text}
                            </div>

                            {/* Avatar Người dùng */}
                            {chat.role === 'user' && (
                                <div style={{ width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#94a3b8', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem', flexShrink: 0, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                    👤
                                </div>
                            )}
                        </div>
                    ))}
                    {loading && <p style={{ color: '#64748b', fontStyle: 'italic', alignSelf: 'flex-start' }}>Đang soạn câu trả lời...</p>}
                </div>
            </div>

            {/* Khu vực nhập liệu */}
            <div style={{ backgroundColor: 'white', padding: '15px', display: 'flex', justifyContent: 'center', borderTop: '1px solid #ffffffff' }}>
                <div style={{ width: '100%', maxWidth: '800px', display: 'flex', gap: '10px' }}>
                    <textarea className="auth-input" style={{ margin: 0, flex: 1, borderRadius: '20px', padding: '12px 20px', border: '1px solid #cbd5e1', resize: 'none', fontFamily: 'inherit' }} value={input}
                        rows={2} placeholder="Mô tả triệu chứng..." onChange={handleChange} onKeyDown={handleKeyDown} />
                    <button className="btn-primary" style={{ width: '80px', borderRadius: '20px', padding: '0', margin: 0, fontWeight: 'bold' }} onClick={handleSend}>Gửi</button>
                </div>
            </div>
        </div>
    );
}

export default AIConsult;