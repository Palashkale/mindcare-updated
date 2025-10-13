import express from "express";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// ✅ JWT secret (store securely in production)
const JWT_SECRET = "xYz@9234!longRandomSecret$tokenKey";

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

// ✅ Login endpoint
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0)
      return res.status(401).json({ message: "Invalid credentials" });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "2h",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Logout endpoint
router.post("/logout", (req, res) => {
  res.status(200).json({ message: "Logout successful" });
});

export default router;
