import { analyzeImageService } from "../services/image.service.js";

export const analyzeImageController = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Thiếu file ảnh (field: image)" });
        }
        const filePath = req.file.path;
        const result = await analyzeImageService(filePath);
        return res.json(result);
    } catch (err) {
        console.error("Analyze error:", err);
        return res.status(500).json({ message: err.message });
    }
};
