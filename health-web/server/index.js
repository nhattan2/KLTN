const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Dùng địa chỉ localhost này để máy tự nói chuyện với chính nó
mongoose.connect('mongodb://127.0.0.1:27017/health-web')
    .then(() => console.log("✅ Đã kết nối MongoDB LOCAL thành công!"))
    .catch(err => console.log("❌ Lỗi kết nối: ", err));

// 2. ĐỊNH NGHĨA CẤU TRÚC (SCHEMA) - Phải đặt TRƯỚC khi tạo Model
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// 3. TẠO MODEL TỪ SCHEMA
const UserModel = mongoose.model("users", UserSchema);

// 4. API ĐĂNG KÝ
app.post('/register', (req, res) => {
    UserModel.create(req.body)
        .then(user => res.json({ status: "success", data: user }))
        .catch(err => res.status(400).json({ status: "error", message: err.message }));
});
// API ĐĂNG NHẬP
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    UserModel.findOne({ email: email })
        .then(user => {
            if (user) {
                if (user.password === password) {
                    res.json("Success");
                } else {
                    res.json("Sai mật khẩu rồi bạn ơi!");
                }
            } else {
                res.json("Email này chưa đăng ký thành viên!");
            }
        })
        .catch(err => res.json(err));
});
// 5. CHẠY SERVER
app.listen(3001, () => {
    console.log("🚀 Server đang chạy mượt mà ở cổng 3001");
});