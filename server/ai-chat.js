import express from "express";
import { Groq } from "groq-sdk";

const router = express.Router();

// Replace this with your actual Groq API key
const GROQ_API_KEY = "";

const groq = new Groq({ apiKey: GROQ_API_KEY });

router.post("/", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a compassionate and supportive mental health assistant. Only respond to queries related to mental well-being, stress, emotions, anxiety, self-care, or personal support. Answer should be short and simple between 50–80 words max",
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
    console.error("LLaMA API error:", err);
    res.write(`data: [ERROR] ${err.message}\n\n`);
    res.end();
  }
});

export default router;
