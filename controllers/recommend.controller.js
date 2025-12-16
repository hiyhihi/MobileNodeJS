import NguoiDung from "../models/nguoidung.model.js";
import BaiDang from "../models/baidang.model.js";

import { getPreferredDifficulty } from "../utils/recommend.helper.js";
import { calculateScore } from "../services/recommend.service.js";

export const recommendPosts = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await NguoiDung.findById(userId)
            .populate("fav")
            .populate("viewedPosts.post");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const posts = await BaiDang.find();

        const preferredDifficulty = getPreferredDifficulty(user.viewedPosts);

        const scoredPosts = posts.map(post => ({
            post,
            score: calculateScore(
                post,
                user,
                preferredDifficulty
            )
        }));

        const result = scoredPosts
            .filter(i => i.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 10)
            .map(i => i.post);

        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const trackView = async (req, res) => {
    try {
        const { userId, postId } = req.body;
    
        const user = await NguoiDung.findById(userId);
        const viewed = user.viewedPosts.find(v => v.post.equals(postId));

        if (viewed) {
            viewed.count += 1;
            viewed.viewedAt = new Date();
        } else {
            user.viewedPosts.push({ post: postId });
        }
    
        await user.save();
    
        await BaiDang.findByIdAndUpdate(postId, {
            $inc: { views: 1 }
        });
    
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const trackIgnore = async (req, res) => {
    try {
        const { userId } = req.body;
        const { postId } = req.params;

        if (!userId || !postId) {
        return res.status(400).json({ message: "Missing data" });
        }

        await NguoiDung.findByIdAndUpdate(
        userId,
        {
            $addToSet: {
            ignoredPosts: {
                post: postId,
                ignoredAt: new Date()
            }
            }
        },
        { new: true }
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: error.message });
    }
};


