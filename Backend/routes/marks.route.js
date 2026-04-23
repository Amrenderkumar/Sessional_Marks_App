import express from "express";
import Mark from "../models/Marks.model.js";
import Subject from "../models/Subject.model.js";
import { authenticate, requireRole } from "../middleware/auth.js";
import { calculateGrade } from "../utils/grading.js";

const router = express.Router();

router.get("/", authenticate, async (req, res) => {
  const { studentId, sessionId, subjectId } = req.query;
  const filter = {};
  if (studentId) filter.studentId = studentId;
  if (sessionId) filter.sessionId = sessionId;
  if (subjectId) filter.subjectId = subjectId;
  const marks = await Mark.find(filter)
    .populate("studentId", "name rollNumber")
    .populate("subjectId", "name code maxMarks")
    .populate("sessionId", "name year");
  res.json(marks);
});

router.post("/", authenticate, requireRole("teacher"), async (req, res) => {
  try {
    const { studentId, subjectId, sessionId, marksObtained, remarks } = req.body;
    const subject = await Subject.findById(subjectId);
    const grade = calculateGrade(marksObtained, subject?.maxMarks || 100);

    const mark = await Mark.findOneAndUpdate(
      { studentId, subjectId, sessionId },
      { marksObtained, grade, remarks },
      { new: true, upsert: true }
    );
    res.status(201).json(mark);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", authenticate, requireRole("teacher"), async (req, res) => {
  const m = await Mark.findById(req.params.id);
  if (!m) return res.status(404).json({ error: "Not found" });
  const subject = await Subject.findById(m.subjectId);
  req.body.grade = calculateGrade(req.body.marksObtained, subject?.maxMarks || 100);
  const updated = await Mark.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete("/:id", authenticate, requireRole("teacher"), async (req, res) => {
  await Mark.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
