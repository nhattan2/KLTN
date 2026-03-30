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

// Model Người dùng (Có thêm role mặc định, specialization và active)
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, sparse: true },
    cccd: { type: String, unique: true, sparse: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    specialization: { type: String, default: '' }, // chuyên khoa cho bác sĩ
    active: { type: Boolean, default: true } // trạng thái kích hoạt/khóa tài khoản
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

// Model Dịch vụ khám bệnh
const ServiceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: String,
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});
const ServiceModel = mongoose.model("services", ServiceSchema);

// Model Lịch hẹn khám
const AppointmentSchema = new mongoose.Schema({
    patientUsername: { type: String, required: true },
    doctorId: String,
    doctorName: String,
    serviceId: String,
    serviceName: String,
    servicePrice: Number,
    appointmentDate: { type: String, required: true },
    timeSlot: { type: String, required: true },
    status: {
        type: String,
        default: 'confirmed',
        enum: ['pending', 'confirmed', 'completed', 'cancelled']
    },
    createdAt: { type: Date, default: Date.now }
});
const AppointmentModel = mongoose.model("appointments", AppointmentSchema);

// Model Thanh toán
const PaymentSchema = new mongoose.Schema({
    appointmentId: String,
    patientUsername: String,
    serviceName: String,
    doctorName: String,
    amount: { type: Number, required: true },
    method: {
        type: String,
        default: 'online',
        enum: ['online', 'cash']
    },
    status: {
        type: String,
        default: 'success',
        enum: ['pending', 'success', 'failed']
    },
    transactionId: String,
    paidAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});
const PaymentModel = mongoose.model("payments", PaymentSchema);

// Seed dữ liệu mẫu dịch vụ khi khởi động
async function seedServices() {
    const count = await ServiceModel.countDocuments();
    if (count === 0) {
        await ServiceModel.insertMany([
            { name: "Khám tổng quát", description: "Khám sức khỏe tổng quát, kiểm tra các chỉ số cơ bản", price: 200000, category: "kham-tong-quat" },
            { name: "Tư vấn chuyên khoa", description: "Tư vấn với bác sĩ chuyên khoa theo yêu cầu", price: 350000, category: "chuyen-khoa" },
            { name: "Xét nghiệm máu", description: "Xét nghiệm công thức máu, đường huyết, mỡ máu", price: 150000, category: "xet-nghiem" },
            { name: "Siêu âm", description: "Siêu âm ổ bụng, tuyến giáp, tim mạch", price: 300000, category: "sieu-am" },
            { name: "Đo điện tim (ECG)", description: "Đo và phân tích điện tâm đồ", price: 180000, category: "xet-nghiem" },
            { name: "Khám nội tiết", description: "Khám và tư vấn các bệnh lý nội tiết", price: 400000, category: "chuyen-khoa" },
            { name: "Khám da liễu", description: "Khám và điều trị các bệnh lý về da", price: 250000, category: "chuyen-khoa" },
            { name: "Chụp X-quang", description: "Chụp X-quang phổi, xương, khớp", price: 220000, category: "xet-nghiem" }
        ]);
        console.log("✅ Đã tạo dữ liệu mẫu dịch vụ khám bệnh!");
    }
}
seedServices();

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

// Lấy danh sách bác sĩ (role === 'doctor'), loại bỏ password trước khi trả
app.get('/api/admin/doctors', async (req, res) => {
    try {
        const doctors = await UserModel.find({ role: 'doctor' }).select('-password').sort({ createdAt: -1 }).lean();
        // Trả về mảng trực tiếp để frontend dễ xử lý
        res.json(doctors);
    } catch (err) {
        console.error('Lỗi lấy danh sách bác sĩ', err);
        res.status(500).json({ success: false, message: 'Lỗi lấy danh sách bác sĩ' });
    }
});

// Cập nhật trạng thái active của bác sĩ (body: { active: true/false })
app.patch('/api/admin/doctors/:id/toggle-active', async (req, res) => {
    try {
        const { id } = req.params;
        const { active } = req.body;
        if (typeof active !== 'boolean') {
            return res.status(400).json({ success: false, message: 'Trường active phải là boolean' });
        }

        const updated = await UserModel.findByIdAndUpdate(id, { active }, { new: true }).select('-password');
        if (!updated) return res.status(404).json({ success: false, message: 'Không tìm thấy bác sĩ' });

        res.json({ success: true, data: updated });
    } catch (err) {
        console.error('Lỗi cập nhật trạng thái bác sĩ', err);
        res.status(500).json({ success: false, message: 'Lỗi cập nhật trạng thái bác sĩ' });
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

// ============================================
// 7. API DỊCH VỤ KHÁM BỆNH
// ============================================

// Lấy danh sách dịch vụ (active)
app.get('/api/services', async (req, res) => {
    try {
        const services = await ServiceModel.find({ active: true }).sort({ price: 1 });
        res.json(services);
    } catch (err) {
        res.status(500).json({ error: "Lỗi lấy danh sách dịch vụ" });
    }
});

// Lấy tất cả dịch vụ (cho admin, kể cả inactive)
app.get('/api/admin/services', async (req, res) => {
    try {
        const services = await ServiceModel.find().sort({ createdAt: -1 });
        res.json(services);
    } catch (err) {
        res.status(500).json({ error: "Lỗi lấy danh sách dịch vụ" });
    }
});

// Admin tạo dịch vụ
app.post('/api/admin/services', async (req, res) => {
    try {
        const service = await ServiceModel.create(req.body);
        res.json({ success: true, data: service });
    } catch (err) {
        res.status(500).json({ success: false, message: "Lỗi tạo dịch vụ" });
    }
});

// Admin cập nhật dịch vụ
app.put('/api/admin/services/:id', async (req, res) => {
    try {
        const updated = await ServiceModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ success: false, message: "Không tìm thấy" });
        res.json({ success: true, data: updated });
    } catch (err) {
        res.status(500).json({ success: false, message: "Lỗi cập nhật" });
    }
});

// Admin toggle active dịch vụ
app.patch('/api/admin/services/:id/toggle', async (req, res) => {
    try {
        const service = await ServiceModel.findById(req.params.id);
        if (!service) return res.status(404).json({ success: false });
        service.active = !service.active;
        await service.save();
        res.json({ success: true, data: service });
    } catch (err) {
        res.status(500).json({ success: false, message: "Lỗi cập nhật" });
    }
});

// Admin xóa dịch vụ
app.delete('/api/admin/services/:id', async (req, res) => {
    try {
        await ServiceModel.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Đã xóa dịch vụ" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Lỗi xóa" });
    }
});

// ============================================
// 8. API ĐẶT LỊCH HẸN & THANH TOÁN
// ============================================

// Lấy danh sách bác sĩ đang hoạt động
app.get('/api/doctors-available', async (req, res) => {
    try {
        const doctors = await UserModel.find({ role: 'doctor', active: true }).select('-password');
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ error: "Lỗi lấy danh sách bác sĩ" });
    }
});

// Bệnh nhân đặt lịch + thanh toán giả lập
app.post('/api/book-appointment', async (req, res) => {
    try {
        const { patientUsername, doctorId, doctorName, serviceId, serviceName, servicePrice, appointmentDate, timeSlot, paymentMethod } = req.body;

        // 1. Tạo lịch hẹn
        const appointment = await AppointmentModel.create({
            patientUsername,
            doctorId,
            doctorName,
            serviceId,
            serviceName,
            servicePrice,
            appointmentDate,
            timeSlot,
            status: 'confirmed'
        });

        // 2. Tạo thanh toán giả lập (luôn thành công)
        const transactionId = 'TXN' + Date.now() + Math.floor(Math.random() * 1000);
        const payment = await PaymentModel.create({
            appointmentId: appointment._id.toString(),
            patientUsername,
            serviceName,
            doctorName,
            amount: servicePrice,
            method: paymentMethod || 'online',
            status: 'success',
            transactionId,
            paidAt: new Date()
        });

        res.json({
            success: true,
            message: "Đặt lịch và thanh toán thành công!",
            appointment,
            payment
        });
    } catch (err) {
        console.error("Lỗi đặt lịch:", err);
        res.status(500).json({ success: false, message: "Lỗi đặt lịch" });
    }
});

// Lấy lịch hẹn của bệnh nhân
app.get('/api/appointments/:username', async (req, res) => {
    try {
        const appointments = await AppointmentModel.find({ patientUsername: req.params.username }).sort({ createdAt: -1 });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ error: "Lỗi lấy lịch hẹn" });
    }
});

// Lấy lịch hẹn cho bác sĩ
app.get('/api/doctor/appointments/:doctorId', async (req, res) => {
    try {
        const appointments = await AppointmentModel.find({ doctorId: req.params.doctorId }).sort({ appointmentDate: -1 });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ error: "Lỗi lấy lịch hẹn bác sĩ" });
    }
});

// Cập nhật trạng thái lịch hẹn
app.patch('/api/appointments/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const updated = await AppointmentModel.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!updated) return res.status(404).json({ success: false, message: "Không tìm thấy lịch hẹn" });
        res.json({ success: true, data: updated });
    } catch (err) {
        res.status(500).json({ success: false, message: "Lỗi cập nhật" });
    }
});

// Hủy lịch hẹn (cập nhật cả payment)
app.patch('/api/appointments/:id/cancel', async (req, res) => {
    try {
        const appointment = await AppointmentModel.findByIdAndUpdate(req.params.id, { status: 'cancelled' }, { new: true });
        if (!appointment) return res.status(404).json({ success: false });
        // Cập nhật payment thành failed
        await PaymentModel.findOneAndUpdate({ appointmentId: req.params.id }, { status: 'failed' });
        res.json({ success: true, data: appointment });
    } catch (err) {
        res.status(500).json({ success: false, message: "Lỗi hủy lịch hẹn" });
    }
});

// ============================================
// 9. API LỊCH SỬ THANH TOÁN
// ============================================

// Lịch sử thanh toán của bệnh nhân
app.get('/api/payments/:username', async (req, res) => {
    try {
        const payments = await PaymentModel.find({ patientUsername: req.params.username }).sort({ createdAt: -1 });
        res.json(payments);
    } catch (err) {
        res.status(500).json({ error: "Lỗi lấy lịch sử thanh toán" });
    }
});

// Admin: Thống kê doanh thu
app.get('/api/admin/payment-stats', async (req, res) => {
    try {
        const totalPayments = await PaymentModel.countDocuments({ status: 'success' });
        const totalRevenue = await PaymentModel.aggregate([
            { $match: { status: 'success' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalAppointments = await AppointmentModel.countDocuments();
        const cancelledAppointments = await AppointmentModel.countDocuments({ status: 'cancelled' });

        // Doanh thu theo dịch vụ
        const revenueByService = await PaymentModel.aggregate([
            { $match: { status: 'success' } },
            { $group: { _id: '$serviceName', total: { $sum: '$amount' }, count: { $sum: 1 } } },
            { $sort: { total: -1 } }
        ]);

        // Thanh toán gần đây (10 giao dịch)
        const recentPayments = await PaymentModel.find({ status: 'success' }).sort({ createdAt: -1 }).limit(10);

        res.json({
            totalPayments,
            totalRevenue: totalRevenue[0]?.total || 0,
            totalAppointments,
            cancelledAppointments,
            revenueByService,
            recentPayments
        });
    } catch (err) {
        res.status(500).json({ error: "Lỗi lấy thống kê" });
    }
});

app.listen(3001, () => console.log("🚀 Server MediCare đang chạy tại cổng 3001"));