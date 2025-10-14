import BaiDang from '../models/baidang.model.js';
import NguoiDung from '../models/nguoidung.model.js';

export const getAllBaiDangs = async (req, res) => {
    try {
        const baidangs = await BaiDang.find({}).sort({ luotThich: -1 });
        res.status(200).json(baidangs);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const createBaiDang = async (req, res) => {
    try {
        const { nguoidungId } = req.params;
        const baidang = await BaiDang.create(req.body);
        const nguoidung = await NguoiDung.findByIdAndUpdate(
            nguoidungId,
            { $addToSet: { post: baidang._id }},
            { new: true}
        );
        res.status(200).json({nguoidung, baidang});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const getBaiDangById = async (req, res) => {
    try {
        const { id } = req.params;

        const baidang = await BaiDang.findById(id);

        if (!baidang){
            return res.status(404).json({message: "Khong tim thay bai dang"});
        }
        res.status(200).json(baidang);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const searchBaiDang = async (req, res) => {
    try {
        const {tenMon} = req.body;
        const baidang = await BaiDang.find({
            tenMon: { $regex: tenMon, $options: 'i'}
        });
        res.status(200).json(baidang);    
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

export const updateBaiDang = async (req, res) => {
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
};

export const deleteBaiDang = async (req, res) => {
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
};

export const searchBaiDangbyIngre = async (req, res) => {
    try {
        const { nguyenLieu } = req.body;
        const tenNguyenLieuArr = nguyenLieu.map(item => item.ten.toLowerCase());
        const result = await BaiDang.aggregate([
            {
                $addFields: {
                    nguyenLieuLower: {
                        $map: {
                            input: "$nguyenLieu",
                            as: "nl",
                            in: { $toLower: "$$nl.ten"}
                        }
                    }
                }
            },
            {
                $addFields: {
                    matchedCount: {
                        $size: {
                            $setIntersection: ["$nguyenLieuLower", tenNguyenLieuArr]
                        }
                    }
                }
            },
            {
                $match: {
                    matchedCount: { $gt: 0}
                }
            },
            {
                $sort: {
                    matchedCount: -1, luotThich: -1
                }
            },
            {
                $project: {
                    tenMon: 1,
                    nguyenLieu: 1,
                    cachLam: 1,
                    nguyenLieuDinhLuong: 1,
                    luotThich: 1,
                    linkYtb: 1,
                    image: 1
                }
            }
        ]);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};
