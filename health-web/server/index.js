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

// 5. Chạy Server
app.listen(3001, () => {
    console.log("🚀 Server đang chạy mượt mà ở cổng 3001");
});