import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "NguoiDung",
        required: true
    },

    targetType: {
        type: String,
        enum: ["post", "reel"],
        required: true
    },

    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    content: {
        type: String,
        required: true
    },

    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        default: null
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;