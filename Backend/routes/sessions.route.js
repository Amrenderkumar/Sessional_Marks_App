import express from "express";
import Session from "../models/Session.model.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticate, async (_req, res) => {
  res.json(await Session.find().sort({ year: -1 }));
});

router.post("/", authenticate, requireRole("teacher"), async (req, res) => {
  try {
    if (req.body.isActive) {
      await Session.updateMany({}, { isActive: false });
    }
    res.status(201).json(await Session.create(req.body));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", authenticate, requireRole("teacher"), async (req, res) => {
  if (req.body.isActive) {
    await Session.updateMany({ _id: { $ne: req.params.id } }, { isActive: false });
  }
  res.json(await Session.findByIdAndUpdate(req.params.id, req.body, { new: true }));
});

router.delete("/:id", authenticate, requireRole("teacher"), async (req, res) => {
  await Session.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
