import fs from "fs";

export const analyzeImageService = async (filePath) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Thiếu GEMINI_API_KEY trong .env");

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const mime = filePath.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg";
    const base64 = fs.readFileSync(filePath, "base64");

    const body = {
        generationConfig: { responseMimeType: "application/json" },
        contents: [
        {
            role: "user",
            parts: [
            {
                inline_data: { mime_type: mime, data: base64 }
            },
            {
                text: `Bạn là AI nhận diện nguyên liệu nấu ăn bằng ảnh. Trả về raw JSON, ít hơn 6 nguyên liệu, chỉ lấy tên nguyên liệu, không cần mô tả, không markdown đúng như mẫu dưới đây:
                {
                "nguyenLieu": [
                    { "ten": "ingredient_name" }
                ]
                }`
            }
            ]
        }
        ]
    };

    const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    const result = await resp.json();
    const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const cleaned = rawText.replace(/```json|```/g, "").trim();
    const json = JSON.parse(cleaned);
    console.log("JSON KET QUA:", JSON.stringify(json, null, 2));
    return json;
};

