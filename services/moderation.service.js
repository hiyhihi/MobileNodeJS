import fs from "fs";

export const checkContentWithGemini = async (text) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Thiếu GEMINI_API_KEY trong .env");

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const body = {
        generationConfig: {
            responseMimeType: "application/json"
        },
        contents: [
            {
                role: "user",
                parts: [
                    {
                        text: `
                            Bạn là hệ thống kiểm duyệt nội dung cho mạng xã hội.

                            Nhiệm vụ:
                            - Kiểm tra nội dung có vi phạm hay không.

                            Vi phạm bao gồm:
                            - Bạo lực
                            - Khiêu dâm
                            - Thù ghét, xúc phạm
                            - Nội dung bị cấm theo pháp luật
                            - Spam, lừa đảo

                            Yêu cầu BẮT BUỘC:
                            - Chỉ trả về JSON
                            - Không markdown
                            - Không giải thích
                            - Không thêm chữ

                            Định dạng JSON:
                            {
                            "allowed": true | false,
                            "reason": "lý do nếu bị chặn, rỗng nếu được phép"
                            }

                            Nội dung cần kiểm tra:
                            """${text}"""
                            `
                    }
                ]
            }
        ]
    };

    console.log("Checking content...");

    const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    if (!resp.ok) {
        throw new Error(`Gemini HTTP ${resp.status}`);
    }

    const result = await resp.json();
    const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const cleaned = rawText.replace(/```json|```/g, "").trim();
    const json = JSON.parse(cleaned);

    console.log(
        json.allowed
            ? "[Gemini] Content PASSED"
            : "[Gemini] Content BLOCKED"
    );

    return json;
};
