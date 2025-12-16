import express from "express";
import { addComment } from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/reels/upload", addComment);

export default router;
