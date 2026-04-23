import express from "express";
import Mark from "../models/Marks.model.js";
import Student from "../models/Student.model.js";
import Subject from "../models/Subject.model.js";
import Session from "../models/Session.model.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/overview", authenticate, async (_req, res) => {
  const [students, subjects, sessions, marks] = await Promise.all([
    Student.countDocuments(),
    Subject.countDocuments(),
    Session.countDocuments(),
    Mark.countDocuments(),
  ]);
  res.json({ students, subjects, sessions, marks });
});

router.get("/student/:id", authenticate, async (req, res) => {
  const marks = await Mark.find({ studentId: req.params.id })
    .populate("subjectId", "name code maxMarks")
    .populate("sessionId", "name year");

  const total = marks.reduce((s, m) => s + m.marksObtained, 0);
  const max = marks.reduce((s, m) => s + (m.subjectId?.maxMarks || 100), 0);
  const percentage = max ? +((total / max) * 100).toFixed(2) : 0;

  res.json({
    totalMarks: total,
    maxMarks: max,
    percentage,
    subjectsCount: marks.length,
    marks,
  });
});

export default router;
