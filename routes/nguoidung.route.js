import express from "express";
import { getAllNguoiDungs, getNguoiDungById, createNguoiDung, checklogin, updateNguoiDung, patchNguoiDung, addFavorite, deleteFavorite} from "../controllers/nguoidung.controller.js";

const router = express.Router();
// https://661r3b81-3000.asse.devtunnels.ms/api/nguoidung/login
router.get("/", getAllNguoiDungs);
router.get('/:id', getNguoiDungById);
router.post('/register', createNguoiDung);
router.post('/login', checklogin);
router.put('/:id', updateNguoiDung);
router.patch('/patch', patchNguoiDung);     
router.patch('/patch/addFav', addFavorite);
router.patch('/patch/deleteFav', deleteFavorite);

export default router;
