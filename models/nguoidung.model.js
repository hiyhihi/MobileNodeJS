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
            require: [true, "Hãy điền username"]
        },
        password: {
            type: String,
            require: [true, "Hãy điền password"]
        },
        fav: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "BaiDang",
                required: false
            }
        ]  
    }
);

const NguoiDung = mongoose.model("NguoiDung", nguoidungSchema);

export default NguoiDung;