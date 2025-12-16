import NguoiDung from '../models/nguoidung.model.js';
import BaiDang from '../models/baidang.model.js';
import jwt from "jsonwebtoken";
import { getTransporter } from "../services/nodemailer.js";
import Comment from '../models/comment.model.js';

export const addComment = async (req, res) => {
    try {
        const nguoidung = await NguoiDung.find();
        if (!nguoidung) {
            return res.status(401).json("Không tìm thấy người dùng");
        }
        res.status(200).json(nguoidung);
    } catch (error) {
        console.error(error);
        res.status(500).json("Không fetch được dữ liệu");
    }
};
