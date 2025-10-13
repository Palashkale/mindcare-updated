import express from "express";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

const router = express.Router();

// ✅ MySQL connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Pank0986!",
  database: "csmss",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ✅ Signup API
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
  }

  try {
    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email],
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword],
    );

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
