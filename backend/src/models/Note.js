import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    summary: { type: String },
  },
  { timestamps: true }
);

noteSchema.index({ title: "text", content: "text", summary: "text" });

export default mongoose.model("Note", noteSchema);
