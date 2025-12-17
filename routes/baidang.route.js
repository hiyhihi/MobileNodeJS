import express from "express";
import { getAllBaiDangs, getBaiDangById, updateBaiDang, deleteBaiDang, searchBaiDang, searchBaiDangbyIngre, getAllVideo, getSelfPost, getRecentViewed } from "../controllers/baidang.controller.js";

const router = express.Router();

router.get("/", getAllBaiDangs);
router.get("/:id", getBaiDangById);
router.put("/update/:id", updateBaiDang);
router.delete("/delete/:id", deleteBaiDang);
router.post("/search", searchBaiDang);
router.post("/search/ingredient", searchBaiDangbyIngre);
router.post("/getAllVideo", getAllVideo);
router.get("/getSelfPost/:nguoidungId", getSelfPost);
router.get("/getRecent/:nguoidungId", getRecentViewed);

export default router;
