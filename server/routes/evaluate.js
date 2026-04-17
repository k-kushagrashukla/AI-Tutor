import express from "express";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post("/", async (req, res) => {
  try {
    const { answer, question } = req.body;

    const prompt = `
You are an expert tutor evaluator.

Evaluate the candidate’s answer based on:
- Clarity
- Patience
- Communication
- Simplicity
- Confidence

Question: ${question}
Answer: ${answer}

Return ONLY valid JSON:
{
  "clarity": number,
  "patience": number,
  "communication": number,
  "simplicity": number,
  "confidence": number,
  "feedback": "short feedback",
  "improvement": "what to improve"
}
`;

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",  // 🔥 Groq model
      messages: [
        { role: "user", content: prompt }
      ],
    });

    const text = response.choices[0].message.content;

    // ⚠️ Sometimes Groq adds extra text → safer parsing
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;
    const cleanJson = text.slice(jsonStart, jsonEnd);

    const parsed = JSON.parse(cleanJson);

    res.json(parsed);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI parsing failed" });
  }
});

export default router;