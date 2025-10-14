import mongoose from "mongoose";

const nguoidungSchema = mongoose.Schema(
    {
        name: {
            type: String,
            require: [true, "Hãy điền tên người dùng"]
        },
        phone: {
            type: String,
            require: [false]
        },
        email: {
            type: String,
            require: [false]
        },
        address: {
            type: String,
            require: [false]
        },
        username: {
            type: String,
            require: [true, "Hãy điền username"],
            unique: true
        },
        password: {
            type: String,
            require: [true, "Hãy điền password"]
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
        ]  
    }
);

const NguoiDung = mongoose.model("NguoiDung", nguoidungSchema);

export default NguoiDung;