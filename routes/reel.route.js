import express from "express";
import { uploadReels, getAllReels, likeReel, trackViewReels } from "../controllers/reel.controller.js";
import { moderatePostContent } from "../middlewares/moderation.middleware.js";
import { uploadVideo } from "../middlewares/uploadVideo.middleware.js";

const router = express.Router();

router.post("/upload", uploadVideo.single("video"), moderatePostContent, uploadReels);
router.get("/", getAllReels);
router.post("/:reelId/like", likeReel);
router.put("/trackViewReels/:reelId", trackViewReels);

export default router;
