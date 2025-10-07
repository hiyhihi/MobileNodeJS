import NguoiDung from '../models/nguoidung.model.js'

export const getAllNguoiDungs = async (req, res) => {
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
};

export const getNguoiDungById = async (req, res) => {
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
}

export const createNguoiDung = async (req, res) => {
    try {
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

export const updateNguoiDung = async (req, res) => {
    try {
        const { id } = req.params;
        const nguoidung = await NguoiDung.findByIdAndUpdate(id, req.body, {new: true});

        if (!nguoidung) {
            return res.status(404).json({message: "Khong tim thay nguoi dung"});
        }
        const updatednguoidung = await nguoidung.findById(id);
        res.status(200).json(updatednguoidung);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const patchNguoiDung = async (req, res) => {
    try {
        const nguoidung = await NguoiDung.findByIdAndUpdate(req.body.id, req.body);
        res.status(200).json({
            status: "success",
            message: "Update thong tin nguoi dung thanh cong",
            data: nguoidung    
        });
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
            return res.status(404).json({message: "Không tìm thấy bài đăng"});
        }
        res.status(200).json(nguoidung);
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
        res.status(200).json(nguoidung);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};