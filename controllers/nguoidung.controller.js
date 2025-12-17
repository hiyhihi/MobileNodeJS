import NguoiDung from '../models/nguoidung.model.js';
import BaiDang from '../models/baidang.model.js';
import jwt from "jsonwebtoken";
import { getTransporter } from "../services/nodemailer.js";

export const getAllNguoiDungs = async (req, res) => {
    try {
        const nguoidung = await NguoiDung.find();
        if (!nguoidung) {
            return res.status(401).json("Không tìm thấy người dùng");
        }
        res.status(200).json(nguoidung);
    } catch (error) {
        console.error(error);
        res.status(500).json("Không fetch được dữ liệu");
    }
};

export const getNguoiDungById = async (req, res) => {
    try {
        const { id } = req.params;
        const nguoidung = await NguoiDung.findById(id);
        if (!nguoidung) {
            return res.status(401).json("Không tìm thấy người dùng");
        }
        res.status(200).json(nguoidung);
    } catch (error) {
        console.error(error);
        res.status(500).json("Không fetch được dữ liệu");
    }
}

export const createNguoiDung = async (req, res) => {
    try {
        const { username } = req.body
        const existed = await NguoiDung.findOne({ username });
        if (existed){
            return res.status(400).json({message: "Username đã tồn tại"})
        }
        const nguoidung = await NguoiDung.create(req.body);
        res.status(200).json(nguoidung);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const checklogin = async (req, res) => {
    const {username, password} = req.body;

    try {
        const nguoidung = await NguoiDung.findOne({
            username: username}).lean();
        if (!nguoidung) return res.status(401).json({message: "Sai tên đăng nhập"});
        if (nguoidung.password !== password) return res.status(401).json({message: "Sai mật khẩu"});

        const token = jwt.sign({ 
            id: nguoidung._id, username: nguoidung.username }, 
            process.env.JWT_KEY, 
            { expiresIn: process.env.JWT_EXPIRE });
        delete nguoidung.password;
        res.status(200).json(nguoidung);    
            
    } catch (error) {
        console.error("Lỗi fetch data :", error);
        res.status(500).json("Không fetch được dữ liệu");
    }
};

export const forgotPassword = async(req, res) => {
    const {email} = req.body;

    try {
        const nguoidung = await NguoiDung.findOne({email});
        if (!nguoidung) return res.status(404).json({message: "Email không hợp lệ"});
        console.log(email);

        const otp = Math.floor(10000 + Math.random() * 90000).toString();
        const expireTime = Date.now() + 5 * 60 * 1000;

        nguoidung.otp = otp;
        nguoidung.otpExpire = expireTime;
        await nguoidung.save();

        console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS);

        const transporter = getTransporter();
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Mã OTP đặt lại mật khẩu",
            html: `<h3>Mã OTP của bạn là: <b>${otp}</b></h3>
            <p>Có hiệu lực trong 5 phút.</p>`
        });
        
        return res.status(200).json({message: "Đã gửi mã OTP đến email"})
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const checkOTP = async (req, res) => {
    const {email, otp} = req.body;
    
    try {
        const nguoidung = await NguoiDung.findOne({email});
        if (!nguoidung) return res.status(401).json({message: "Email không hợp lệ"}); 
        if (otp !== nguoidung.otp) return res.status(400).json({message: "Mã OTP sai"});
        if (nguoidung.otpExpire < Date.now()) return res.status(400).json({message: "Mã OTP hết hạn"}); 
        
        return res.status(200).json({message: "Xác nhận OTP thành công"}); 
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const resetPassword = async(req, res) => {
    const {email, nPassword} = req.body;

    try {
        const nguoidung = await NguoiDung.findOne({email});
        if (!nguoidung) return res.status(401).json({message: "Không tìm thấy email"});

        nguoidung.password = nPassword;
        nguoidung.otp = undefined;
        nguoidung.otpExpire = undefined;

        await nguoidung.save();

        res.status(200).json({ message: "Đổi mật khẩu thành công" });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const patchNguoiDung = async (req, res) => {
    try {
        const { username } = req.body;
        const existed = await NguoiDung.findOne({username});
        const curuser = await NguoiDung.findById(req.body._id);
        if(existed._id.equals(curuser._id)) {
            const nguoidung = await NguoiDung.findByIdAndUpdate(req.body._id, req.body, {new: true});
            if (!nguoidung) {
                return res.status(404).json({message: "Không tìm thấy người dùng"});
            }
            const updatednguoidung = await NguoiDung.findById(req.body._id);
            res.status(200).json({data: updatednguoidung, status: "success" ,message: "Cập nhật thông tin người dùng thành công"});
        }
        else if (existed && !existed._id.equals(curuser._id)) {
            return res.status(400).json({message: "Username đã tồn tại"})
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const addFavorite = async (req, res) => {
    try {
        const { nguoidungId, baidangId } = req.body;
        // const nguoidung = await NguoiDung.findByIdAndUpdate(
        //     nguoidungId,
        //     { $addToSet: {fav: baidangId}},
        //     { new: true}
        // );
        // if (!nguoidung) {
        //     return res.status(404).json({message: "Không tìm thấy người dùng"});
        // }
        // const baidang = await BaiDang.findByIdAndUpdate(
        //     baidangId,
        //     { $inc: {luotThich: 1}},
        //     { new: true}
        // );
        // if (!baidang) {
        //     return res.status(404).json({message: "Không tìm thấy bài đăng"});
        // }

        const nguoidung = await NguoiDung.findById(nguoidungId);
        const baidang = await BaiDang.findById(baidangId);

        const isLiked = nguoidung.fav.some(id => String(id) === String(baidangId));

        if (isLiked) {
            nguoidung.fav = nguoidung.fav.filter(id => String(id) !== String(baidangId));
            baidang.luotThich = Math.max(baidang.luotThich - 1, 0);
        }
        else {
            nguoidung.fav.push(baidangId);
            baidang.luotThich += 1;
        }
        await nguoidung.save();
        await baidang.save();

        res.status(200).json({ liked: !isLiked, totalLikes: baidang.luotThich, nguoidung});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// export const deleteFavorite = async(req, res) => {
//     try {
//         const { nguoidungId, baidangId } = req.body;
//         const nguoidung = await NguoiDung.findByIdAndUpdate(
//             nguoidungId,
//             { $pull: {fav: baidangId}},
//             { new: true}
//         );
//         if (!nguoidung) {
//             return res.status(404).json({ message: "Không tìm thấy người dùng" });
//         }
//         const baidang = await BaiDang.findByIdAndUpdate(
//             baidangId,
//             { $inc: { luotThich: -1}},
//             { new: true}
//         );
//         if (!baidang) {
//             return res.status(404).json({message: "Không tìm thấy bài đăng"});
//         }
//         res.status(200).json({ nguoidung, baidang });
//     } catch (error) {
//         res.status(500).json({message: error.message});
//     }
// };

export const getFavorite = async(req, res) => {
    try {
        const { id } = req.params;
        const nguoidung = await NguoiDung.findById(id).populate("fav");
        res.status(200).json(nguoidung.fav);
    } catch (error) {
        res.status(500).json({message: error.message}); 
    }
};

export const createPost = async (req, res) => {
    try {
        const { id } = req.params;
        const baidang = await BaiDang.create(req.body);
        await NguoiDung.findByIdAndUpdate(
            id,
            { $addToSet: { post: baidang._id }},
            { new: true}
        ).populate("post");
        res.status(200).json({status: "success", message: "Tạo bài đăng thành công", data: baidang});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { baidangId } = req.body;
        await BaiDang.findByIdAndDelete(baidangId);
        await NguoiDung.findByIdAndUpdate(
            id,
            { $pull: { post: baidangId }},
            { new: true}
        );
        res.status(200).json({message: "Xóa bài đăng thành công"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};