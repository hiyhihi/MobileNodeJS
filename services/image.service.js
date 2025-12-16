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
                text:  `Bạn là AI nhận diện nguyên liệu nấu ăn từ hình ảnh.
                        Yêu cầu:
                        - Nếu hình ảnh là đồ ăn hoặc món ăn:
                        - Nhận diện các nguyên liệu có thể thấy rõ.
                        - Trả về raw JSON đúng cấu trúc bên dưới.
                        - Tối đa 5 nguyên liệu.
                        - Chỉ trả về tên nguyên liệu, không mô tả, không giải thích, không markdown.
                        - Nếu hình ảnh KHÔNG phải đồ ăn, KHÔNG phải món ăn, hoặc không thể nhận diện được nguyên liệu:
                        - Trả về JSON rỗng: {}

                        Định dạng JSON bắt buộc khi có nguyên liệu:
                        {
                            "nguyenLieu": [
                                { "ten": "ingredient_name" }
                            ]
                        }

                        Không trả về bất kỳ nội dung nào ngoài JSON.`
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

    console.log("RAW AI RESPONSE:", resp);
    const result = await resp.json();
    const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const cleaned = rawText.replace(/```json|```/g, "").trim();
    const json = JSON.parse(cleaned);
    console.log("JSON KET QUA:", JSON.stringify(json, null, 2));
    return json;
};

