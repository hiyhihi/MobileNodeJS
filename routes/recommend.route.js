import express from "express";
import { recommendPosts, trackView } from "../controllers/recommend.controller.js";

const router = express.Router();

router.get("/:userId", recommendPosts);
router.post("/view/:postId", trackView);

export default router;