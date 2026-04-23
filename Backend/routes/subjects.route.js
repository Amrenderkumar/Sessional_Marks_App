import express from "express";
import Subject from "../models/Subject.model.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticate, async (_req, res) => {
  res.json(await Subject.find().sort({ code: 1 }));
});

router.post("/", authenticate, requireRole("teacher"), async (req, res) => {
  try {
    res.status(201).json(await Subject.create(req.body));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", authenticate, requireRole("teacher"), async (req, res) => {
  res.json(await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true }));
});

router.delete("/:id", authenticate, requireRole("teacher"), async (req, res) => {
  await Subject.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
