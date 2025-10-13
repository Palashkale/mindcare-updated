import express from "express";
import mysql from "mysql2/promise";

const router = express.Router();

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

  return sortedFactors;
};

router.get("/", async (req, res) => {
  try {
    const factors = await getRecurringFactors();

    if (factors.length === 0) {
      return res.json({ communities: [] });
    }

    const query = `
      SELECT name, description, keywords
      FROM community_groups
      WHERE ${factors
        .map((f) => `(LOWER(description) LIKE ? OR LOWER(keywords) LIKE ?)`)
        .join(" OR ")}
      LIMIT 5
    `;

    // Prepare values for ? placeholders, 2 per factor (description + keywords)
    const values = factors.flatMap((f) => [`%${f}%`, `%${f}%`]);

    const [communityRows] = await db.query(query, values);

    res.json({ communities: communityRows });
  } catch (err) {
    console.error("Community Fetch Error:", err.message || err);
    res.status(500).json({ error: "Failed to fetch communities" });
  }
});

export default router;
