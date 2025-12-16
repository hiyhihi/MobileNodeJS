import mongoose from "mongoose";

const reelSchema = mongoose.Schema({
    nguoidung: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "NguoiDung",
        required: true
    },
    tieude: {
        type: String,
        required: true
    },
    videoUrl: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    tags: [
        String
    ],
    nguyenLieu: [
        String
    ],
    likes: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    }
}
);

const Reels = mongoose.model("Reels", reelSchema);

export default Reels;