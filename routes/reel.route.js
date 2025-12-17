import express from "express";
import { uploadReels, getAllReels, likeReel, trackViewReels } from "../controllers/reel.controller.js";

const router = express.Router();

router.post("/upload", uploadReels);
router.get("/", getAllReels);
router.post("/:reelId/like", likeReel);
router.put("/trackViewReels/:reelId", trackViewReels);

export default router;
