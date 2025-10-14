import express from "express";
import { getAllBaiDangs, getBaiDangById, updateBaiDang, deleteBaiDang, searchBaiDang, searchBaiDangbyIngre } from "../controllers/baidang.controller.js";

const router = express.Router();

router.get("/", getAllBaiDangs);
router.get("/:id", getBaiDangById);
router.put("/update/:id", updateBaiDang);
router.delete("/delete/:id", deleteBaiDang);
router.post("/search", searchBaiDang);
router.post("/search/ingredient", searchBaiDangbyIngre);

export default router;
