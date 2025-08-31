import express from "express";
import multer from "multer";
import OpenAI from "openai";
import Note from "../models/Note.js";
import authMiddleware from "../middleware/authMiddleware.js";
import dotenv from "dotenv"

dotenv.config();

const router = express.Router();
const upload = multer({ dest: "uploads/" });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Transcription
router.post("/transcribe", authMiddleware, upload.single("audio"), async (req, res) => {
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: req.file.path,
      model: "whisper-1"
    });
    res.json({ text: transcription.text });
  } catch (error) {
    res.status(500).json({ message: "Error transcribing audio" });
  }
});

// Summarization
router.post("/summarize", authMiddleware, async (req, res) => {
  const { noteId, content } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: `Summarize this text:\n\n${content}` }]
    });

    const summary = response.choices[0].message.content;

    const updatedNote = await Note.findOneAndUpdate(
      { _id: noteId, user: req.user._id },
      { summary },
      { new: true }
    );

    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: "Error summarizing note" });
  }
});

export default router;
