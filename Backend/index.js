import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db/db.js";

import authRoutes from "./routes/auth.route.js";
import studentRoutes from "./routes/students.route.js";
import subjectRoutes from "./routes/subjects.route.js";
import sessionRoutes from "./routes/sessions.route.js";
import markRoutes from "./routes/marks.route.js";
import analyticsRoutes from "./routes/analytics.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:5174",
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "BRCMportal API is running", status: "OK" });
});

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/marks", markRoutes);
app.use("/api/analytics", analyticsRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
});
