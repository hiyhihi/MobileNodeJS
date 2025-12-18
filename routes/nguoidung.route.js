import express from "express";
import { getAllNguoiDungs, getNguoiDungById, createNguoiDung, checklogin, patchNguoiDung, addFavorite, getFavorite, createPost, deletePost, forgotPassword, checkOTP, resetPassword, uploadAva} from "../controllers/nguoidung.controller.js";
import { moderatePostContent } from "../middlewares/moderation.middleware.js";

const router = express.Router();

router.get("/", getAllNguoiDungs);
router.post('/forgotpassword', forgotPassword);
router.post('/checkOTP', checkOTP);
router.patch("/resetpassword", resetPassword);
router.post('/register', createNguoiDung);
router.post('/login', checklogin);
router.patch('/patch', patchNguoiDung);     
router.patch('/patch/addFav', addFavorite);
// router.patch('/patch/deleteFav', deleteFavorite);
router.get('/fav/:id', getFavorite);
router.post("/add/:id", moderatePostContent, createPost);
router.patch("/delete/:id", deletePost);
router.get('/:id', getNguoiDungById);
router.post("/avatar/:nguoidungId", uploadAva);

export default router;
