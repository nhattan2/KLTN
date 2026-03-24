const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// 1. Kết nối MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/health-web')
    .then(() => console.log("✅ Kết nối MongoDB thành công!"))
    .catch(err => console.log("❌ Lỗi kết nối MongoDB: ", err));

// 2. Schema người dùng (Hỗ trợ 1 trong 3: Email/SĐT/CCCD)
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, sparse: true },
    cccd: { type: String, unique: true, sparse: true },
    password: { type: String, required: true }
});

const UserModel = mongoose.model("users", UserSchema);

// 3. API Đăng ký
app.post('/register', (req, res) => {
    UserModel.create(req.body)
        .then(user => res.json({ status: "success" }))
        .catch(err => {
            console.error(err);
            res.status(400).json({ status: "error", message: "Thông tin đã tồn tại!" });
        });
});

// 4. API Đăng nhập
app.post('/login', (req, res) => {
    const { loginKey, password } = req.body;
    UserModel.findOne({
        $or: [{ email: loginKey }, { phone: loginKey }, { cccd: loginKey }]
    }).then(user => {
        if (user && user.password === password) {
            res.json({ status: "Success", username: user.username });
        } else {
            res.json({ status: "Error", message: "Sai tài khoản hoặc mật khẩu!" });
        }
    }).catch(err => res.status(500).json({ status: "Error", message: "Lỗi kết nối Server!" }));
});

app.listen(3001, () => console.log("🚀 Backend đang chạy tại cổng 3001"));