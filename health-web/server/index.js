const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(express.json());
app.use(cors());

// 1. Kết nối MongoDB Local
mongoose.connect('mongodb://127.0.0.1:27017/health-web')
    .then(() => console.log("✅ Hệ thống Medicare đã kết nối Database thành công!"))
    .catch(err => console.log("❌ Lỗi kết nối Database: ", err));

// 2. Định nghĩa các Model (Schema)

// Model Người dùng (Có thêm role mặc định)
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, sparse: true },
    cccd: { type: String, unique: true, sparse: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' }
});
const UserModel = mongoose.model("users", UserSchema);

// Model Hồ sơ bệnh án chi tiết (Khớp với CreateMedicalRecord.js)
const MedicalRecordDetailSchema = new mongoose.Schema({
    username: String,
    fullName: String,
    dob: String,
    gender: String,
    address: String,
    phone: String,
    email: String,
    cccd: String,
    medicalHistory: String,
    allergies: String,
    currentMedications: String,
    familyHistory: String,
    notes: String,
    createdAt: { type: Date, default: Date.now }
});
const MedicalRecordDetailModel = mongoose.model("medical_records_details", MedicalRecordDetailSchema);
// Model Chỉ số sức khỏe nhanh (Dashboard)
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

// 3. API Đăng nhập & Đăng ký

app.post('/register', (req, res) => {
    UserModel.create(req.body)
        .then(user => res.json({ status: "success", username: user.username }))
        .catch(err => res.status(400).json({ status: "error", message: "Thông tin đã tồn tại!" }));
});

app.post('/login', (req, res) => {
    const { loginKey, password } = req.body;
    UserModel.findOne({ $or: [{ email: loginKey }, { phone: loginKey }, { cccd: loginKey }] })
        .then(user => {
            if (user && user.password === password) {
                // Trả về role để Frontend lưu vào localStorage
                res.json({
                    status: "Success",
                    username: user.username,
                    role: user.role || 'user'
                });
            } else {
                res.json({ status: "Error", message: "Sai tài khoản hoặc mật khẩu!" });
            }
        }).catch(() => res.status(500).json({ status: "Error", message: "Lỗi Server!" }));
});

// 4. API Hồ sơ bệnh án & Thống kê

// Lưu hồ sơ bệnh án chi tiết
app.post('/api/create-medical-record', async (req, res) => {
    try {
        const newRecord = await MedicalRecordDetailModel.create(req.body);
        res.json({ success: true, message: "Lưu hồ sơ thành công!", data: newRecord });
    } catch (error) {
        res.status(500).json({ success: false, message: "Không thể lưu hồ sơ." });
    }
});

// Lấy thống kê cho Admin
app.get('/api/admin/stats', async (req, res) => {
    try {
        const userCount = await UserModel.countDocuments({ role: 'user' });
        const doctorCount = await UserModel.countDocuments({ role: 'doctor' });
        const recordCount = await HealthModel.countDocuments();
        res.json({ userCount, doctorCount, recordCount });
    } catch (err) {
        res.status(500).json({ error: "Lỗi lấy thống kê" });
    }
});

// 5. API Tư vấn AI Gemini (Xoay vòng Key)

const apiKeys = [
    "AIzaSyBnOsJ3gUQWv5oVaU3JwDV39nWde1zPGpY",
    "AIzaSyDPQh6Hq54xTJgWNS7Ny73eLINNdpBkAd0",
    "AIzaSyAv1fxUI3QaCF6MhqzVd0OlnKgw-eSM848"
];
let currentKeyIndex = 0;

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

            currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
            return res.json({ reply: cleanReply });
        } catch (err) {
            attempts++;
            currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
        }
    }
    res.status(500).json({ error: "AI đang bận, thử lại sau nhé Tân!" });
});

// 6. API Cập nhật & Lấy chỉ số sức khỏe

app.post('/api/update-health', async (req, res) => {
    try {
        const { username, heartRate, bloodPressure, bloodSugar } = req.body;
        let systolic = 0;
        if (bloodPressure.includes('/')) {
            systolic = parseInt(bloodPressure.split('/')[0]);
        } else {
            systolic = parseInt(bloodPressure);
        }

        let healthStatus = "Bình thường";
        if (systolic >= 140 || heartRate > 100) healthStatus = "Cảnh báo: Cao";
        else if (systolic < 90 || heartRate < 60) healthStatus = "Cảnh báo: Thấp";

        const newRecord = await HealthModel.create({
            userId: username,
            heartRate,
            bloodPressure: bloodPressure.includes('/') ? bloodPressure : `${bloodPressure}/--`,
            bloodSugar,
            status: healthStatus
        });
        res.json({ success: true, data: newRecord });
    } catch (error) {
        res.status(500).json({ error: "Lỗi lưu chỉ số!" });
    }
});

app.get('/api/get-health/:username', async (req, res) => {
    try {
        const record = await HealthModel.findOne({ userId: req.params.username }).sort({ createdAt: -1 });
        res.json(record || { heartRate: '--', bloodPressure: '--/--', bloodSugar: '--', status: 'Chưa có dữ liệu' });
    } catch (error) {
        res.status(500).json({ error: "Lỗi lấy dữ liệu" });
    }
});

app.get('/api/get-medical-record/:username', async (req, res) => {
    try {
        const { username } = req.params;
        // Tìm hồ sơ mới nhất của username này
        const record = await MedicalRecordDetailModel.findOne({ username }).sort({ createdAt: -1 });

        if (record) {
            res.json(record);
        } else {
            res.status(404).json({ message: "Không tìm thấy hồ sơ" });
        }
    } catch (error) {
        res.status(500).json({ error: "Lỗi Server" });
    }
});

app.listen(3001, () => console.log("🚀 Server MediCare đang chạy tại cổng 3001"));