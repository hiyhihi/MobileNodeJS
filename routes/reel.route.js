import express from "express";
import { uploadReels, getAllReels, likeReel } from "../controllers/reel.controller.js";

const router = express.Router();

router.post("/upload", uploadReels);
router.get("/", getAllReels);
router.post("/:reelId/like", likeReel);

export default router;
