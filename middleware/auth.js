import jwt from "jsonwebtoken";

/**
 * Verifies JWT token from Authorization header: "Bearer <token>".
 * Attaches decoded user payload to req.user.
 */
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ error: "Access denied. No token provided." });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, is_admin }
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired token." });
  }
};

/*
  Requires the authenticated user to be an admin.
  Use this on routes that only admins should access.
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user?.is_admin)
    return res.status(403).json({ error: "Admin access required." });

  next();
};