import express from "express";
import mysql from "mysql2/promise";
import { Groq } from "groq-sdk";

const router = express.Router();

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const groq = new Groq({ apiKey: GROQ_API_KEY });

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Pank0986!",
  database: "csmss",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const getRecurringFactors = async () => {
  const [rows] = await db.query(`SELECT factors FROM moods`);

  const factorCounts = {};
  rows.forEach(({ factors }) => {
    if (!factors || typeof factors !== "string") return;

    factors.split(",").forEach((f) => {
      const clean = f.trim().toLowerCase();
      factorCounts[clean] = (factorCounts[clean] || 0) + 1;
    });
  });

  const sortedFactors = Object.entries(factorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([f]) => f);

  return sortedFactors.join(", ");
};

router.get("/", async (req, res) => {
  try {
    const factors = await getRecurringFactors();

    const prompt = `These are the top recurring mental health factors today: ${factors}. Suggest a professional daily mental health tip.`;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a compassionate and supportive mental health assistant. Only respond to queries related to mental well-being, stress, emotions, anxiety, self-care, or personal support. Answer should be short and simple between 25-35 words max. and always generate different answer ",
        },
        { role: "user", content: prompt },
      ],
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: true,
    });

    for await (const chunk of chatCompletion) {
      const content = chunk.choices[0]?.delta?.content || "";
      res.write(`data: ${content}\n\n`);
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
    console.error("Daily Tip Streaming Error:", err);
    res.write(`data: [ERROR] ${err.message}\n\n`);
    res.end();
  }
});

export default router;
