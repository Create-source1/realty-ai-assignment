import { useState, useEffect } from "react";
import { Mic, Plus, LogOut, Search, Volume2, Clock, Sparkles } from "lucide-react";
import NoteCard from "../components/NoteCard";

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  // Fetch notes from backend
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE}/api/notes`)
      .then((res) => res.json())
      .then((data) => setNotes(data))
      .catch((err) => console.error(err));
  }, []);

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      const chunks = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);

      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("file", blob);

        // Send audio to backend
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/notes/upload`, {
          method: "POST",
          body: formData,
        });
        const newNote = await res.json();
        setNotes((prev) => [newNote, ...prev]);
      };

      recorder.start();
      setRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f9f9ff] to-[#eaeaff] p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-md">
            <Mic className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-indigo-600">Voice Notes AI</h1>
            <p className="text-sm text-gray-500">Welcome back, Pooja Jaiswal</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={recording ? stopRecording : startRecording}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-md text-white font-medium transition ${
              recording
                ? "bg-red-500 hover:bg-red-600"
                : "bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90"
            }`}
          >
            <Plus className="w-4 h-4" />
            {recording ? "Stop Recording" : "New Note"}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium shadow hover:bg-gray-200">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="flex items-center gap-2 bg-white shadow rounded-full px-4 py-2 mb-6">
        <Search className="text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search your notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full focus:outline-none text-sm"
        />
        <button className="px-4 py-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full shadow hover:opacity-90">
          Search
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-gray-500">Total Notes</p>
          <h2 className="text-2xl font-bold text-purple-600">{notes.length}</h2>
          <Volume2 className="mx-auto mt-2 text-purple-500" />
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-gray-500">Summarized</p>
          <h2 className="text-2xl font-bold text-purple-600">
            {notes.filter((n) => n.summary).length}
          </h2>
          <Sparkles className="mx-auto mt-2 text-purple-500" />
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-gray-500">Recent Activity</p>
          <h2 className="text-2xl font-bold text-teal-600">
            {notes[0]?.title || "None"}
          </h2>
          <Clock className="mx-auto mt-2 text-teal-500" />
        </div>
      </div>

      {/* Notes list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notes.length === 0 ? (
          <div className="bg-white shadow rounded-xl p-8 text-center col-span-2">
            <Mic className="h-10 w-10 text-purple-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-700">No notes yet</h3>
            <p className="text-gray-500 mb-4">
              Start creating your first voice note! Click "New Note" to begin recording.
            </p>
            <button
              onClick={startRecording}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-medium shadow hover:opacity-90"
            >
              <Mic className="w-4 h-4 inline mr-2" /> Create First Note
            </button>
          </div>
        ) : (
          notes
            .filter((note) =>
              note.title.toLowerCase().includes(search.toLowerCase())
            )
            .map((note) => <NoteCard key={note._id} note={note} />)
        )}
      </div>
    </div>
  );
}
