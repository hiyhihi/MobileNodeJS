import NguoiDung from '../models/nguoidung.model.js';
import Reels from '../models/reels.model.js';
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const uploadReels = async (req, res) => {
    try {
        const { userId, tieude, description, tags, nguyenLieu } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Video file is required" });
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: "video",
            folder: "reels"
        });

        fs.unlinkSync(req.file.path);

        const newReel = await Reels.create({
            nguoidung: userId,
            tieude,
            description,
            videoUrl: result.secure_url, 
            tags: tags ? tags.split(",") : [],
            nguyenLieu: nguyenLieu ? nguyenLieu.split(",") : []
        });

        await NguoiDung.findByIdAndUpdate(userId, {
            $push: { reels: newReel._id }
        });

        res.status(201).json(newReel);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllReels = async (req, res) => {
    try {
        const reels = await Reels.find({})
        .populate("nguoidung", "nguoidung name")
        .sort({ createdAt: -1 });

        res.status(200).json(reels);
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

export const trackViewReels = async(req, res) => {
    try {
        const { reelId } = req.params;
    
        const reel = await Reels.findByIdAndUpdate(reelId, {
            $inc: { views: 1 }
        });
    
        res.json({ success: true , views: reel.views});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSelfReels = async (req, res) => {
    try {
        const { nguoidungId } = req.params;

        const nguoidung = await NguoiDung.findById(nguoidungId).populate({
            path: 'reels.reel',
            model: 'Reels',
        });

        if (!nguoidung) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
        }

        const reels = nguoidung.reels || [];
        const reelsNums = nguoidung.reels.length;
        const tongLike = reels.reduce((sum, r) => sum + (r.likes || 0), 0);

        res.status(200).json({ reels, reelsNums, tongLike});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};