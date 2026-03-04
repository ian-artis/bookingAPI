import pool from "../config/db.js";
import bcrypt from "bcryptjs";

/*
  Admin-only: create a user (can set is_admin, is_active).
 */
export const createUser = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      mobile_no,
      is_admin,
      is_active
    } = req.body;

    const existing = await pool.query(
      "SELECT id FROM users WHERE email=$1",
      [email]
    );
    if (existing.rows.length > 0)
      return res.status(400).json({ error: "Email already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (first_name, last_name, email, password, mobile_no, is_admin, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, first_name, last_name, email, mobile_no, is_admin, is_active, created_at`,
      [
        first_name,
        last_name,
        email,
        hashedPassword,
        mobile_no,
        is_admin ?? false,
        is_active ?? true
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*
  Admin-only: get all users (active and inactive).
 */
export const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, first_name, last_name, email, mobile_no, is_admin, is_active, created_at
       FROM users
       ORDER BY id`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*
  Admin-only: get a single user by id.
 */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT id, first_name, last_name, email, mobile_no, is_admin, is_active, created_at
       FROM users
       WHERE id=$1`,
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "User not found." });

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*
  Admin-only: update user fields (except password here).
 */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      email,
      mobile_no,
      is_admin,
      is_active
    } = req.body;

    const result = await pool.query(
      `UPDATE users
       SET first_name=$1,
           last_name=$2,
           email=$3,
           mobile_no=$4,
           is_admin=$5,
           is_active=$6
       WHERE id=$7
       RETURNING id, first_name, last_name, email, mobile_no, is_admin, is_active, created_at`,
      [first_name, last_name, email, mobile_no, is_admin, is_active, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "User not found." });

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*
  Admin-only: toggle user active/inactive.
 */
export const toggleUserActive = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE users
       SET is_active = NOT is_active
       WHERE id=$1
       RETURNING id, first_name, last_name, email, mobile_no, is_admin, is_active, created_at`,
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "User not found." });

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*
  Admin-only: delete user.
  Enrollments are deleted automatically via ON DELETE CASCADE.
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM users WHERE id=$1 RETURNING id, email",
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "User not found." });

    res.json({ message: "User deleted.", deleted: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};