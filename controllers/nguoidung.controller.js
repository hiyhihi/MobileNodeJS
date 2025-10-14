import NguoiDung from '../models/nguoidung.model.js';
import BaiDang from '../models/baidang.model.js';

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
        const nguoidung = await NguoiDung.findByIdAndUpdate(
            nguoidungId,
            { $addToSet: {fav: baidangId}},
            { new: true}
        );
        if (!nguoidung) {
            return res.status(404).json({message: "Không tìm thấy người dùng"});
        }
        const baidang = await BaiDang.findByIdAndUpdate(
            baidangId,
            { $inc: {luotThich: 1}},
            { new: true}
        );
        if (!baidang) {
            return res.status(404).json({message: "Không tìm thấy bài đăng"});
        }
        res.status(200).json({ nguoidung, baidang });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const deleteFavorite = async(req, res) => {
    try {
        const { nguoidungId, baidangId } = req.body;
        const nguoidung = await NguoiDung.findByIdAndUpdate(
            nguoidungId,
            { $pull: {fav: baidangId}},
            { new: true}
        );
        if (!nguoidung) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }
        const baidang = await BaiDang.findByIdAndUpdate(
            baidangId,
            { $inc: { luotThich: -1}},
            { new: true}
        );
        if (!baidang) {
            return res.status(404).json({message: "Không tìm thấy bài đăng"});
        }
        res.status(200).json({ nguoidung, baidang });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

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
        res.status(200).json({message: "Xoa bai dang thanh cong"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};