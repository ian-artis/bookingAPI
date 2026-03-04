import pool from "../config/db.js";

/*
  User-only: enroll in a course.
  - Uses req.user.id from JWT (so user cannot enroll as someone else).
  - Blocks enrollment if course is inactive.
  - Blocks enrollment if user is inactive.
 */
export const createEnrollment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { course_id } = req.body;

    // Check user is active
    const userResult = await pool.query(
      "SELECT is_active FROM users WHERE id=$1",
      [userId]
    );
    if (userResult.rows.length === 0 || !userResult.rows[0].is_active)
      return res.status(400).json({ error: "Inactive or missing user." });

    // Check course is active
    const courseResult = await pool.query(
      "SELECT is_active FROM courses WHERE id=$1",
      [course_id]
    );
    if (courseResult.rows.length === 0)
      return res.status(404).json({ error: "Course not found." });
    if (!courseResult.rows[0].is_active)
      return res.status(400).json({ error: "Cannot enroll in inactive course." });

    // Prevent duplicate enrollment
    const existing = await pool.query(
      `SELECT id FROM enrollments
       WHERE user_id=$1 AND course_id=$2`,
      [userId, course_id]
    );
    if (existing.rows.length > 0)
      return res.status(400).json({ error: "Already enrolled in this course." });

    const result = await pool.query(
      `INSERT INTO enrollments (user_id, course_id)
       VALUES ($1, $2)
       RETURNING id, user_id, course_id, enrolled_at`,
      [userId, course_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*
  Admin-only: get all enrollments with joined user + course info.
 */
export const getAllEnrollments = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT e.id,
             e.user_id,
             e.course_id,
             u.first_name,
             u.last_name,
             u.email,
             u.is_active AS user_active,
             c.name AS course_name,
             c.price,
             c.is_active AS course_active,
             e.enrolled_at
      FROM enrollments e
      JOIN users u ON e.user_id = u.id
      JOIN courses c ON e.course_id = c.id
      ORDER BY e.id
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*
  User-only: get enrollments for the logged-in user.
 */
export const getMyEnrollments = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT e.id,
             e.course_id,
             c.name AS course_name,
             c.description,
             c.price,
             e.enrolled_at
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE e.user_id = $1
      ORDER BY e.enrolled_at DESC
    `,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*
  Admin-only: delete an enrollment.
 */
export const deleteEnrollment = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM enrollments WHERE id=$1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Enrollment not found." });

    res.json({ message: "Enrollment deleted.", deleted: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};