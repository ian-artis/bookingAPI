import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/*
  Public registration endpoint.
 - Creates a normal (non-admin) user.
 - Hashes password before storing.
 - Ensures email is unique.
 */
export const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password, mobile_no } = req.body;

    const existing = await pool.query(
      "SELECT id FROM users WHERE email=$1",
      [email]
    );
    if (existing.rows.length > 0)
      return res.status(400).json({ error: "Email already registered." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (first_name, last_name, email, password, mobile_no)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, first_name, last_name, email, mobile_no, is_admin, is_active, created_at`,
      [first_name, last_name, email, hashedPassword, mobile_no]
    );

    res.status(201).json({
      message: "User registered successfully.",
      user: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*
 Login endpoint.
 - Validates email + password.
 - Returns JWT token with user id, email, is_admin.
*/
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );
    if (result.rows.length === 0)
      return res.status(400).json({ error: "User not found." });

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Incorrect password." });

    const token = jwt.sign(
      { id: user.id, email: user.email, is_admin: user.is_admin },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login successful.", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};