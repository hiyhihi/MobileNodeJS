import express from "express";
import { getAllNguoiDungs, getNguoiDungById, createNguoiDung, checklogin, patchNguoiDung, addFavorite, deleteFavorite, getFavorite, createPost, deletePost} from "../controllers/nguoidung.controller.js";

const router = express.Router();

router.get("/", getAllNguoiDungs);
router.get('/:id', getNguoiDungById);
router.post('/register', createNguoiDung);
router.post('/login', checklogin);
router.patch('/patch', patchNguoiDung);     
router.patch('/patch/addFav', addFavorite);
router.patch('/patch/deleteFav', deleteFavorite);
router.get('/fav/:id', getFavorite);
router.post("/add/:id",createPost);
router.patch("/delete/:id", deletePost);

export default router;
