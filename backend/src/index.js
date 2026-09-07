import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import publicRoutes from "./routes/public.js";
import adminRoutes from "./routes/admin.js";
import { errorHandler } from "./middleware/error.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT || 4000);

const origins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (origins.length === 0 || origins.includes("*") || origins.includes(origin)) {
        return callback(null, true);
      }
      if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(
  "/uploads",
  express.static(path.resolve(__dirname, "../", process.env.UPLOAD_DIR || "uploads"), {
    maxAge: "1h",
    etag: true,
    lastModified: true,
    setHeaders(res) {
      // Long cache for immutable hashed filenames; revalidate for CMS replacements
      res.setHeader("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");
    },
  })
);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "education-doorway-api" });
});

app.use("/api/public", publicRoutes);
app.use("/api/admin", adminRoutes);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
