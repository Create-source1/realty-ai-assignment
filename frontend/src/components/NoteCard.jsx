import { useState } from "react";
import API from "../api/axiosConfig";
import LoadingSpinner from "./LoadingSpinner";

export default function NoteCard({ note, onUpdated, onDeleted }) {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(note.content || "");
  const [saving, setSaving] = useState(false);
  const [summarizing, setSummarizing] = useState(false);

  // When parent re-renders with new note, sync local content
  // (Useful when note prop changes after update)
  if (note.content !== content && !editing) {
    setContent(note.content || "");
  }

  const save = async () => {
    setSaving(true);
    try {
      // If the content changed, clear summary on backend
      const payload = { content };
      if (content !== note.content) payload.summary = null;

      const { data } = await API.put(`/notes/${note._id}`, payload);
      onUpdated && onUpdated(data);
      setEditing(false);
    } catch (e) {
      console.error("Save error:", e);
      alert("Failed to save note");
    } finally {
      setSaving(false);
    }
  };

  const del = async () => {
    if (!confirm("Delete this note?")) return;
    try {
      await API.delete(`/notes/${note._id}`);
      onDeleted && onDeleted(note._id);
    } catch (e) {
      console.error("Delete error:", e);
      alert("Failed to delete note");
    }
  };

  const summarize = async () => {
    // Prevent double-clicks
    if (summarizing) return;
    setSummarizing(true);
    try {
      // call backend summarize endpoint - backend should return the updated note
      const { data } = await API.post("/ai/summarize", {
        noteId: note._id,
        content: note.content,
      });

      // If backend returns updated note object, use it; else, merge summary
      const updated =
        data && data._id ? data : { ...note, summary: data.summary || "" };
      onUpdated && onUpdated(updated);
    } catch (e) {
      console.error("Summarize error:", e);
      alert("Failed to generate summary");
    } finally {
      setSummarizing(false);
    }
  };

  const createdAt = new Date(note.createdAt).toLocaleString();
  const updatedAt = new Date(note.updatedAt || note.createdAt).toLocaleString();
  const hasSummary = Boolean(note.summary && note.summary.trim().length > 0);

  return (
    <div className="bg-white rounded-2xl shadow p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg truncate">
            {note.title || "Untitled"}
          </h3>
          <div className="text-xs text-gray-500 mt-1">
            Updated: {updatedAt} • Created: {createdAt}
          </div>
        </div>
      </div>

      {!editing ? (
        <p className="whitespace-pre-wrap text-sm text-gray-800">
          {note.content}
        </p>
      ) : (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full min-h-[120px] p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      )}

      {note.summary && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-sm">
          <div className="font-medium mb-1">AI Summary</div>
          <div className="text-gray-700 whitespace-pre-wrap">
            {note.summary}
          </div>
        </div>
      )}

      <div className="flex gap-2 items-center">
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Edit
          </button>
        ) : (
          <button
            onClick={save}
            disabled={saving}
            className="px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        )}

        <button
          onClick={del}
          className="px-3 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700"
        >
          Delete
        </button>

        <button
          onClick={summarize}
          disabled={hasSummary || summarizing}
          className={`px-3 py-2 rounded-lg text-white ${
            hasSummary
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {summarizing ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              Generating...
            </span>
          ) : hasSummary ? (
            "Summary Ready"
          ) : (
            "Generate Summary"
          )}
        </button>
      </div>
    </div>
  );
}
