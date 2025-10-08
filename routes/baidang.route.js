import express from "express";
import { createBaiDang, getAllBaiDangs, getBaiDangById, updateBaiDang,deleteBaiDang, searchBaiDang, searchBaiDangbyIngre, addLuotthich } from "../controllers/baidang.controller.js";

const router = express.Router();

router.get("/", getAllBaiDangs);
router.get("/:id", getBaiDangById);
router.post("/add",createBaiDang);
router.put("/update/:id", updateBaiDang);
router.delete("/delete/:id", deleteBaiDang);
router.post("/search", searchBaiDang);
router.post("/search/ingredient", searchBaiDangbyIngre);
router.patch("/like/:id", addLuotthich);

export default router;
