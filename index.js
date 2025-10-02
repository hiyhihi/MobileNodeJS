import express from 'express';
import mongoose from 'mongoose';
import BaiDang from './models/baidang.model.js';
import NguoiDung from './models/nguoidung.model.js';
import dotenv from 'dotenv'
const app = express()
dotenv.config()


app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from cookbyingredient hehe')
});

app.use('/images', express.static('images'));

app.post('/api/addbaidang', async(req, res) => {
    try {
        const baidang = await BaiDang.create(req.body);
        res.status(200).json(baidang);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

app.get('/api/getbaidang', async(req, res) => {
    try {
        const baidangs = await BaiDang.find({});
        res.status(200).json(baidangs);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

app.get('/api/getbaidang/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const baidang = await BaiDang.findById(id);
        res.status(200).json(baidang);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

app.put('/api/getbaidang/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const baidang = await BaiDang.findByIdAndUpdate(id, req.body, {new: true});

        if (!baidang) {
            return res.status(404).json({message: "Khong tim thay bai dang"});
        }
        const updatedBaidang = await BaiDang.findById(id);
        res.status(200).json(updatedBaidang);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

app.delete('/api/getbaidang/:id', async(req, res) => {
    try {
        const { id } = req.params;

        const baidang = await BaiDang.findByIdAndUpdate(id);

        if (!baidang){
            return res.status(404).json({message: "Khong tim thay bai dang"});
        }

        res.status(200).json({message: "Xoa bai dang thanh cong"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

app.post('/api/register', async(req, res) => {
    try {
        const nguoidung = await NguoiDung.create(req.body);
        res.status(200).json(nguoidung);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

app.post('/api/user', async (req, res) => {
    const { username } = req.body;
    try {
        const nguoidung = await NguoiDung.findOne({ username }).lean();
        if (!nguoidung) {
            return res.status(401).json("Không tìm thấy người dùng");
        }
        res.status(200).json(nguoidung);
    } catch (error) {
        console.error(error);
        res.status(500).json("Không fetch được dữ liệu");
    }
});

app.post("/api/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

    try {
        const nguoidung = await NguoiDung.findOne({
            username: username,
            password: password,
        }).lean();
        if (!nguoidung) res.status(401).json("Không tìm thấy người dùng");
        else res.status(200).json(nguoidung);
    } catch (error) {
        console.error("Lỗi fetch data :", error);
        res.status(500).json("Không fetch được dữ liệu");
    }
});

console.log("URI:", process.env.MONGODB_URI || process.env.MONGO_URI);
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log("Connected to database!")
    app.listen(3000, () => {
        console.log('Server is running on port 3000')
    });
})
.catch(() => {
    console.log("Connection failed!")
});