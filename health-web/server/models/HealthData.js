const mongoose = require('mongoose');

const HealthSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    heartRate: Number,      // Nhịp tim (bpm)
    bloodPressure: String,  // Huyết áp 
    bloodSugar: Number,     // Đường huyết (mg/dL)
    pulsePressure: Number,  // Tự tính: Áp lực mạch
    status: String,         // Tự tính: Trạng thái sức khỏe
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("health_records", HealthSchema);