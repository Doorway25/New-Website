import jwt from "jsonwebtoken";
import { HttpError } from "./error.js";

export function requireAuth(req, _res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return next(new HttpError(401, "Authentication required"));
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    next(new HttpError(401, "Invalid or expired token"));
  }
}

export function requireAdmin(req, _res, next) {
  if (!req.user) return next(new HttpError(401, "Authentication required"));
  if (req.user.role !== "admin") return next(new HttpError(403, "Admin access required"));
  next();
}
