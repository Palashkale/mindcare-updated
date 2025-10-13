import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import aiChatRoutes from "./ai-chat.js";
import loginRoutes from "./login.js";
import signupRoutes from "./signup.js";
import moodRoutes from "./mood.js";
import dailyTipRoutes from "./mood-tip.js"; // ✅ NEW
import communityRoutes from "./community.js";

const app = express();
const PORT = 5051;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  }),
);
app.use(bodyParser.json());

app.use("/api/ai-chat", aiChatRoutes);
app.use("/api/auth", loginRoutes);
app.use("/api/auth", signupRoutes);
app.use("/api/mood", moodRoutes);
app.use("/api/daily-tip", dailyTipRoutes);
app.use("/api/community", communityRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
