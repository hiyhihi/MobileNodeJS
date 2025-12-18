import { checkContentWithGemini } from "../services/moderation.service.js";

export const moderatePostContent = async (req, res, next) => {
    try {
        const contentToCheck = `
            ${req.body.tieude || ""}
            ${req.body.description || ""}
            ${req.body.content || ""}
            ${req.body.tags || ""}
        `;

        console.log("[Moderation] CONTENT TO CHECK:");
        console.log(contentToCheck);

        const result = await checkContentWithGemini(contentToCheck);

        console.log("[Moderation] RESULT:");
        console.log(result);

        if (!result.allowed) {
            return res.status(403).json({
                status: "blocked",
                message: "Nội dung vi phạm tiêu chuẩn cộng đồng",
                reason: result.reason
            });
        }

        next();
    } catch (error) {
        console.error("[Moderation ERROR]:", error.message);

        return res.status(500).json({
            message: "Lỗi kiểm duyệt nội dung",
            error: error.message
        });
    }
};
