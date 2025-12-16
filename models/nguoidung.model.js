import mongoose from "mongoose";

const nguoidungSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Hãy điền tên người dùng"]
        },
        phone: {
            type: String,
            required: false
        },
        email: {
            type: String,
            required: false
        },
        address: {
            type: String,
            required: false
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
        fav: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: "BaiDang" }],
            default: []
        },
        post: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: "BaiDang" }],
            default: []
        },
        otp: {
            type: String,
            default: null
        },
        otpExpire: {
            type: Date,
            default: null
        },  
        viewedPosts: [
            {
                post: {type: mongoose.Schema.Types.ObjectId, ref: "BaiDang"},
                viewedAt: { type: Date, default: Date.now()}
            }
        ],
        searchHistory: [
            {
                keyword: String,
                createdAt: {type: Date, default: Date.now()}
            }
        ],
        ingredientHistory: [
            {
                ingredient: String,
                createdAt: { type: Date, default: Date.now }
            }
        ],
        ignoredPost: [
            {
                post: {type: mongoose.Schema.Types.ObjectId, ref: "BaiDang"},
                viewedAt: { type: Date, default: Date.now()}
            }
        ],
        reels: {
            type: [
                {
                    reel: { type: mongoose.Schema.Types.ObjectId, ref: "Reels" },
                    createdAt: { type: Date, default: Date.now() }
                }
            ],
            default: []
        },
        likedReels: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reels" }],
            default: []
        }
    }
);

const NguoiDung = mongoose.model("NguoiDung", nguoidungSchema);

export default NguoiDung;