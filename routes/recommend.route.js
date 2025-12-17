import express from "express";
import { recommendPosts, trackView, trackIgnore} from "../controllers/recommend.controller.js";

const router = express.Router();

router.get("/:userId", recommendPosts);
router.post("/trackView", trackView);
router.post("/trackIgnore", trackIgnore);

export default router;