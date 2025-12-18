import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "video/");
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    }
});

export const uploadVideo = multer({
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("video/")) {
            cb(new Error("Chỉ video được cho phép đăng"));
        } else {
            cb(null, true);
        }
    }
});
