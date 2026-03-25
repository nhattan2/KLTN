const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// 1. Kết nối MongoDB Local
mongoose.connect('mongodb://127.0.0.1:27017/health-web')
    .then(() => console.log("✅ Đã kết nối MongoDB LOCAL thành công!"))
    .catch(err => console.log("❌ Lỗi kết nối MongoDB Local: ", err));

// 2. Định nghĩa Schema người dùng (Hỗ trợ 1 trong 3: Email/SĐT/CCCD)
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    // sparse: true cực kỳ quan trọng để cho phép để trống Email/SĐT/CCCD
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, sparse: true },
    cccd: { type: String, unique: true, sparse: true },
    password: { type: String, required: true }
});

const UserModel = mongoose.model("users", UserSchema);

// 3. API Đăng ký
app.post('/register', (req, res) => {
    // req.body đã được lọc bỏ các trường rỗng từ Frontend
    UserModel.create(req.body)
        .then(user => res.json({ status: "success", username: user.username }))
        .catch(err => {
            console.error("Lỗi đăng ký:", err.message);
            res.status(400).json({ status: "error", message: "Thông tin đã tồn tại hoặc lỗi hệ thống!" });
        });
});

// 4. API Đăng nhập
app.post('/login', (req, res) => {
    const { loginKey, password } = req.body;

    // Dùng $or để tìm bất kỳ trường nào khớp với loginKey (Email/SĐT/CCCD)
    UserModel.findOne({
        $or: [
            { email: loginKey },
            { phone: loginKey },
            { cccd: loginKey }
        ]
    }).then(user => {
        if (user) {
            // Kiểm tra mật khẩu (Nên dùng bcrypt để mã hóa mật khẩu con nhé)
            if (user.password === password) {
                // Đăng nhập thành công -> Trả về Username để Dashboard hiển thị
                res.json({ status: "Success", username: user.username });
            } else {
                res.json({ status: "Error", message: "Mật khẩu không chính xác!" });
            }
        } else {
            res.json({ status: "Error", message: "Tài khoản không tồn tại!" });
        }
    }).catch(err => res.status(500).json({ status: "Error", message: "Lỗi Server!" }));
});

const { GoogleGenAI } = require("@google/genai");

// CƠ CHẾ XOAY VÒNG API KEY (API POOLING)
const apiKeys = [
    "AIzaSyBnOsJ3gUQWv5oVaU3JwDV39nWde1zPGpY", // Key 1
    "AIzaSyDPQh6Hq54xTJgWNS7Ny73eLINNdpBkAd0", // Key 2
    "AIzaSyAv1fxUI3QaCF6MhqzVd0OlnKgw-eSM848"  // Key 3
];

let currentKeyIndex = 0; // Biến theo dõi Key nào đang tới lượt

// API Tư vấn AI
app.post('/api/ai-consult', async (req, res) => {
    try {
        const history = req.body.history || [];

        // Đọc toàn bộ lịch sử hội thoại để AI nhớ ngữ cảnh (chuyển sang chuẩn của Google Gemini)
        const formattedContents = history.map(msg => ({
            role: msg.role === 'ai' ? 'model' : 'user',
            parts: [{ text: msg.text }]
        }));

        let response;
        let success = false;
        let attempts = 0;

        // Vòng lặp tự động thử lại bằng Key khác nếu Key hiện tại bị lỗi Quota
        while (!success && attempts < apiKeys.length) {
            try {
                const activeKey = apiKeys[currentKeyIndex];
                const ai = new GoogleGenAI({ apiKey: activeKey });

                response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: formattedContents,
                    config: {
                        systemInstruction: "Bạn là Bác sĩ chuyên khoa tại hệ thống MediCare. Tuân thủ NGHIÊM NGẶT:\n1. Văn phong ân cần, chuyên nghiệp, sử dụng từ ngữ chuẩn y khoa theo quy định của Bộ Y tế Việt Nam.\n2. LƯU Ý NGỮ CẢNH: Nếu người dùng đáp 'Có' hoặc đồng ý gợi ý thuốc, BẮT BUỘC dựa vào triệu chứng đã kể ở trên để kê tên thuốc. TUYỆT ĐỐI KHÔNG hỏi lại triệu chứng.\n3. Khi đưa ra danh sách thuốc, LUÔN LUÔN kèm theo dòng cảnh báo chốt lại: '⚠️ LƯU Ý: Đây chỉ là thông tin y tế tham khảo. Vui lòng đến cơ sở y tế hoặc liên hệ bác sĩ để được thăm khám và kê đơn chính xác.'\n4. Trả lời thật ngắn gọn, súc tích.\n5. KHÔNG dùng Markdown (*, #, _). Xuống dòng rõ ràng."
                    }
                });

                success = true; // Bật cờ thành công để thoát vòng lặp
                console.log(`✅ AI đã trả lời thành công bằng API Key thứ ${currentKeyIndex + 1}`);

                // Dịch chuyển sang Key tiếp theo cho lượt hỏi sau (Chia tải đều)
                currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;

            } catch (err) {
                console.error(`⚠️ Lỗi hạn mức ở API Key thứ ${currentKeyIndex + 1}`);
                attempts++;
                currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length; // Chuyển Key

                if (attempts < apiKeys.length) {
                    console.log(`🔄 Tự động xoay sang API Key thứ ${currentKeyIndex + 1} để thử lại...`);
                } else {
                    throw new Error("Toàn bộ API Key đều đã hết hạn mức truy cập!");
                }
            }
        }

        // Dùng Regex xóa toàn bộ dấu *, #, _, `, ~ để dọn dẹp hoàn toàn tàn dư của Markdown
        const cleanReply = response.text ? response.text.replace(/[*#_`~]/g, '') : "";

        res.json({ reply: cleanReply });
    } catch (error) {
        console.error("❌ LỖI RỒI TÂN ƠI:", error.message);
        res.status(500).json({ error: "Hệ thống AI đang quá tải. Vui lòng thử lại sau vài phút!" });
    }
});

// 6. CHẠY SERVER (LUÔN ĐỂ Ở CUỐI CÙNG)
app.listen(3001, () => {
    console.log("🚀 Server đang chạy mượt mà ở cổng 3001");
});