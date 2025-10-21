import express from "express";
import multer from "multer";
import { analyzeImageController } from "../controllers/image.controller.js";

const router = express.Router();
const upload = multer({ dest: "cache/" });

router.post("/detect", upload.single("image"), analyzeImageController);

export default router;
