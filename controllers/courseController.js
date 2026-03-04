import pool from "../config/db.js";

/*
  Admin-only: create a course.
 */
export const createCourse = async (req, res) => {
  try {
    const { name, description, price, is_active } = req.body;

    const result = await pool.query(
      `INSERT INTO courses (name, description, price, is_active)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, description, price, is_active, created_at`,
      [name, description, price, is_active ?? true]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*
  Admin-only: get all courses (active and inactive).
 */
export const getAllCourses = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, description, price, is_active, created_at
       FROM courses
       ORDER BY id`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*
  Public: get a single course by id.
  (You can later restrict or filter by is_active if you want.)
 */
export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT id, name, description, price, is_active, created_at
       FROM courses
       WHERE id=$1`,
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Course not found." });

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*
  Admin-only: update course fields.
 */
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, is_active } = req.body;

    const result = await pool.query(
      `UPDATE courses
       SET name=$1,
           description=$2,
           price=$3,
           is_active=$4
       WHERE id=$5
       RETURNING id, name, description, price, is_active, created_at`,
      [name, description, price, is_active, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Course not found." });

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*
  Admin-only: toggle course active/inactive.
 */
export const toggleCourseActive = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE courses
       SET is_active = NOT is_active
       WHERE id=$1
       RETURNING id, name, description, price, is_active, created_at`,
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Course not found." });

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*
 Admin-only: delete course.
 Enrollments are deleted automatically via ON DELETE CASCADE.
 */
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM courses WHERE id=$1 RETURNING id, name",
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Course not found." });

    res.json({ message: "Course deleted.", deleted: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};