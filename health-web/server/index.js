const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// Sửa lại tên thư viện chuẩn của Google
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(express.json());
app.use(cors());

// 1. Kết nối MongoDB Local
mongoose.connect('mongodb://127.0.0.1:27017/health-web')
    .then(() => console.log("✅ Đã kết nối MongoDB LOCAL thành công!"))
    .catch(err => console.log("❌ Lỗi kết nối MongoDB Local: ", err));

// 2. Định nghĩa Schema và Model
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, sparse: true },
    cccd: { type: String, unique: true, sparse: true },
    password: { type: String, required: true }
});
const UserModel = mongoose.model("users", UserSchema);

// Model sức khỏe (Phải khai báo hoặc require từ file riêng)
const HealthSchema = new mongoose.Schema({
    userId: String,
    heartRate: Number,
    bloodPressure: String,
    bloodSugar: Number,
    pulsePressure: Number,
    status: String,
    createdAt: { type: Date, default: Date.now }
});
const HealthModel = mongoose.model("health_records", HealthSchema);

// 3. API Đăng ký & Đăng nhập
app.post('/register', (req, res) => {
    UserModel.create(req.body)
        .then(user => res.json({ status: "success", username: user.username }))
        .catch(err => res.status(400).json({ status: "error", message: "Thông tin đã tồn tại!" }));
});

app.post('/login', (req, res) => {
    const { loginKey, password } = req.body;
    UserModel.findOne({ $or: [{ email: loginKey }, { phone: loginKey }, { cccd: loginKey }] })
        .then(user => {
            if (user && user.password === password) res.json({ status: "Success", username: user.username });
            else res.json({ status: "Error", message: "Sai tài khoản hoặc mật khẩu!" });
        }).catch(err => res.status(500).json({ status: "Error", message: "Lỗi Server!" }));
});

// 4. CƠ CHẾ XOAY VÒNG API KEY
const apiKeys = [
    "AIzaSyBnOsJ3gUQWv5oVaU3JwDV39nWde1zPGpY",
    "AIzaSyDPQh6Hq54xTJgWNS7Ny73eLINNdpBkAd0",
    "AIzaSyAv1fxUI3QaCF6MhqzVd0OlnKgw-eSM848"
];
let currentKeyIndex = 0;

// API Tư vấn AI (Gemini 1.5 Flash)
app.post('/api/ai-consult', async (req, res) => {
    const history = req.body.history || [];
    const formattedContents = history.map(msg => ({
        role: msg.role === 'ai' ? 'model' : 'user',
        parts: [{ text: msg.text }]
    }));

    let attempts = 0;
    while (attempts < apiKeys.length) {
        try {
            const genAI = new GoogleGenerativeAI(apiKeys[currentKeyIndex]);
            const model = genAI.getGenerativeModel({
                model: 'gemini-1.5-flash',
                systemInstruction: "Bạn là Bác sĩ MediCare. Trả lời ân cần, ngắn gọn, không dùng Markdown. Luôn nhắc nhở đi khám bác sĩ nếu có dấu hiệu nặng."
            });

            const result = await model.generateContent({ contents: formattedContents });
            const response = await result.response;
            const cleanReply = response.text().replace(/[*#_`~]/g, '');

            console.log(`✅ Thành công với Key ${currentKeyIndex + 1}`);
            currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
            return res.json({ reply: cleanReply });

        } catch (err) {
            console.error(`⚠️ Key ${currentKeyIndex + 1} lỗi Quota.`);
            attempts++;
            currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
        }
    }
    res.status(500).json({ error: "Hệ thống AI đang quá tải!" });
});

// 5. API Cập nhật sức khỏe (Tự động tính toán)
app.post('/api/update-health', async (req, res) => {
    try {
        const { username, heartRate, bloodPressure, bloodSugar } = req.body;

        // CHỖ NÀY NÈ NÍ: Xử lý nếu người dùng chỉ nhập 1 con số
        let systolic = 0;
        let pulsePressure = 0;

        if (bloodPressure.includes('/')) {
            // Nếu nhập đúng kiểu 120/80
            const bpParts = bloodPressure.split('/');
            systolic = parseInt(bpParts[0]);
            pulsePressure = systolic - parseInt(bpParts[1]);
        } else {
            // Nếu chỉ nhập đúng 1 số (ví dụ: 120)
            systolic = parseInt(bloodPressure);
            pulsePressure = 40; // Gán mặc định hoặc để 0 tùy ý con
        }

        // Tự động phân loại dựa trên con số duy nhất đó
        let healthStatus = "Bình thường";
        if (systolic >= 140 || heartRate > 100) healthStatus = "Cảnh báo: Cao";
        else if (systolic < 90 || heartRate < 60) healthStatus = "Cảnh báo: Thấp";

        if (bloodSugar > 125) healthStatus += " & Đường huyết cao";

        const newRecord = await HealthModel.create({
            userId: username,
            heartRate,
            bloodPressure: bloodPressure.includes('/') ? bloodPressure : `${bloodPressure}/--`,
            bloodSugar,
            pulsePressure,
            status: healthStatus
        });

        res.json({ success: true, data: newRecord });
        console.log("Đã lưu cho:", username);
    } catch (error) {
        console.error("Lỗi Backend:", error.message);
        res.status(500).json({ error: "Lỗi lưu dữ liệu!" });
    }
});
// API Lấy chỉ số sức khỏe mới nhất để hiện lên Dashboard
app.get('/api/get-health/:username', async (req, res) => {
    try {
        const record = await HealthModel.findOne({ userId: req.params.username }).sort({ createdAt: -1 });
        res.json(record || { heartRate: '--', bloodPressure: '--/--', bloodSugar: '--', status: 'Chưa có dữ liệu' });
    } catch (error) {
        res.status(500).json({ error: "Lỗi lấy dữ liệu" });
    }
});

// 6. CHẠY SERVER
app.listen(3001, () => console.log("Server đang chạy tại cổng 3001"));