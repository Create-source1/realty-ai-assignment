import express from "express";
import Note from "../models/Note.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Create Note
router.post("/", authMiddleware, async (req, res) => {
  const { title, content } = req.body;
  try {
    const note = await Note.create({ user: req.user._id, title, content });
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get Notes (search + sort)
router.get("/", authMiddleware, async (req, res) => {
  const { search, sort } = req.query;
  let query = { user: req.user._id };

  if (search) query.$text = { $search: search };
  const notes = await Note.find(query).sort(
    sort === "date" ? { createdAt: -1 } : {}
  );
  res.json(notes);
});

// Update Note
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete Note
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: "Note deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
