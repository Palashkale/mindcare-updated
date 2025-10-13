import express from "express";
import mysql from "mysql2/promise";

const router = express.Router();

// ✅ MySQL connection pool
const db = await mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Pank0986!",
  database: "csmss",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ✅ Create table if not exists
await db.query(`
  CREATE TABLE IF NOT EXISTS moods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date VARCHAR(255) NOT NULL,
    mood INT NOT NULL,
    factors TEXT,
    note TEXT
  )
`);

// ✅ POST: Save mood entry
router.post("/", async (req, res) => {
  const { date, mood, factors, note } = req.body;
  const factorsStr = Array.isArray(factors) ? factors.join(",") : "";

  try {
    const [result] = await db.query(
      `INSERT INTO moods (date, mood, factors, note) VALUES (?, ?, ?, ?)`,
      [date, mood, factorsStr, note],
    );
    res.status(200).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET: Retrieve mood data
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT date, mood FROM moods ORDER BY date`);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET: Mood summary
router.get("/summary", async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT mood FROM moods`);

    const summary = {
      sad: 0,
      neutral: 0,
      happy: 0,
      excited: 0,
      angry: 0,
    };

    rows.forEach(({ mood }) => {
      if (mood <= 2) summary.sad++;
      else if (mood === 3) summary.neutral++;
      else if (mood === 4) summary.happy++;
      else if (mood === 5) summary.excited++;
      else summary.angry++;
    });

    res.status(200).json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
