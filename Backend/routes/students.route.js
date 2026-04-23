import express from "express";
import bcrypt from "bcryptjs";
import Student from "../models/Student.model.js";
import User from "../models/user.model.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticate, async (_req, res) => {
  const students = await Student.find().sort({ rollNumber: 1 });
  res.json(students);
});

router.get("/:id", authenticate, async (req, res) => {
  const s = await Student.findById(req.params.id);
  if (!s) return res.status(404).json({ error: "Student not found" });
  res.json(s);
});

router.post("/", authenticate, requireRole("teacher"), async (req, res) => {
  try {
    const { rollNumber, registrationNumber, name, email, className, section, password } = req.body;
    const hashed = await bcrypt.hash(password || "student123", 10);
    const user = await User.create({
      username: rollNumber,
      password: hashed,
      name,
      role: "student",
    });
    const student = await Student.create({
      userId: user._id, rollNumber, registrationNumber, name, email, className, section,
    });
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", authenticate, requireRole("teacher"), async (req, res) => {
  const s = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(s);
});

router.delete("/:id", authenticate, requireRole("teacher"), async (req, res) => {
  const s = await Student.findByIdAndDelete(req.params.id);
  if (s?.userId) await User.findByIdAndDelete(s.userId);
  res.json({ ok: true });
});

export default router;
