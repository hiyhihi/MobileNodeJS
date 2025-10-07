import mongoose from "mongoose";

const baidangSchema = mongoose.Schema({
    tenMon: {
        type: String,
        required: [true, "Hãy điền tên món ăn"]
    },
    nguyenLieu: [
    {
        ten: {
            type: String,
            required: [true, "Hãy nhập tên nguyên liệu"]
        }
    }
    ],
    nguyenLieuDinhLuong: {
        type: String,
        required: [true, "Hãy nhập định lượng nguyên liệu"]
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
});

const BaiDang = mongoose.model("BaiDang", baidangSchema);

export default BaiDang;