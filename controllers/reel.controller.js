import NguoiDung from '../models/nguoidung.model.js';
import Reels from '../models/reels.model.js';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "video/");
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024 
    },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("video/")) {
            cb(new Error("Only video files are allowed"));
        } else {
            cb(null, true);
        }
    }
});

export const uploadReels = [upload.single("video"), async (req, res) => {
    try {
        const { userId, tieude, description, tags, nguyenLieu } = req.body;

        if (!req.file) {
            return res
            .status(400)
            .json({ message: "Video file is required" });
        }

        const videoUrl = `/video/${req.file.filename}`;

        const newReel = await Reels.create({
            user: userId,
            tieude,
            description,
            videoUrl,
            tags: tags ? tags.split(",") : [],
            nguyenLieu: nguyenLieu ? nguyenLieu.split(",") : []
        });

        await NguoiDung.findByIdAndUpdate(userId, {
            $push: { reels: newReel._id }
        });

        res.status(201).json({newReel});
    } catch (error) {
        console.error("Upload reel error:", error);
        res.status(500).json({message: "Failed to upload reel", error: error.message});
    }
    }
];

export const getAllReels = async (req, res) => {
    try {
        const reels = await Reels.find({})
        .populate("nguoidung", "nguoidung name")
        .sort({ createdAt: -1 });

        res.status(200).json({reels});
    } catch (error) {
        console.error("Get all reels error:", error);
        res.status(500).json({message: error.message});
    }
};

export const likeReel = async (req, res) => {
    try {
        const { userId } = req.body;
        const { reelId } = req.params;

        if (!userId || !reelId) {
            return res.status(400).json({message: "Thiếu userId hoặc reelId"});
        }

        const user = await NguoiDung.findById(userId);
        const reel = await Reels.findById(reelId);

        if (!user || !reel) {
            return res.status(404).json({message: "Không tìm thấy người dùng"});
        }

        const isLiked = user.likedReels.some(id => id.equals(reelId));

        if (isLiked) {
            user.likedReels = user.likedReels.filter(id => !id.equals(reelId));
            reel.likes = Math.max(reel.likes - 1, 0);
        } else {
            user.likedReels.push(reelId);
            reel.likes += 1;
        }

        await user.save();
        await reel.save();

        res.status(200).json({liked: !isLiked,totalLikes: reel.likes});
    } catch (error) {
        console.error("Like reel error:", error);
        res.status(500).json({message: error.message});
    }
};