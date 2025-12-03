import mongoose from "mongoose";

const nguoidungSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Hãy điền tên người dùng"]
        },
        phone: {
            type: String,
            required: [false]
        },
        email: {
            type: String,
            required: [false]
        },
        address: {
            type: String,
            required: [false]
        },
        username: {
            type: String,
            required: [true, "Hãy điền username"],
            unique: true
        },
        password: {
            type: String,
            required: [true, "Hãy điền password"]
        },
        fav: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "BaiDang",
                required: false,
                default: []
            }
        ],
        post: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "BaiDang",
                required: false,
                default: []
            }
        ],
        otp: {
            type: String,
            default: null
        },
        otpExpire: {
            type: Date,
            default: null
        }  
    }
);

const NguoiDung = mongoose.model("NguoiDung", nguoidungSchema);

export default NguoiDung;