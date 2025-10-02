import mongoose from "mongoose";

const baidangSchema = mongoose.Schema(
    {
    tenMon: {
        type: String,
        required: [true, "Hãy điền tên món ăn"]
    },
    nguyenLieu: {
        type: [String],
        required: [true, "Hãy nhập nguyên liệu"]
    },
    nguyenLieuDinhLuong: {
        type: String,
        required: false
    },
    cachLam: {
        type: String,
        required: [true, "Hãy nhập cách làm"]
    },
    linkYtb: {
        type: String,
        required: false,
    },
    luotThich: {
        type: Number,
        required: false
    },
    image: {
        type: String,
        required: false
    }
    }
);

const BaiDang = mongoose.model("BaiDang", baidangSchema);

export default BaiDang;