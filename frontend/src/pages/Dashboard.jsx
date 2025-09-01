import { useEffect, useMemo, useState } from "react";
import API from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";
import Recorder from "../components/Recorder";
import NoteCard from "../components/NoteCard";

// Icons from lucide-react
import { Mic, LogOut, Search, Volume2, Sparkles, Clock } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Dashboard() {
  const { logout } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("updatedAt");
  const [order, setOrder] = useState("desc");

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/notes", {
        params: { search: search || undefined },
      });
      setNotes(data);
    } catch (e) {
      console.error(e);
      if (e?.response?.status === 401) logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const onTranscript = async (text) => {
    const title = text?.slice(0, 48) || "New Note";
    try {
      const { data } = await API.post("/notes", { title, content: text });
      setNotes((prev) => [data, ...prev]);
    } catch (e) {
      console.error(e);
      alert("Failed to create note from transcript");
    }
  };

  const sortedFiltered = useMemo(() => {
    const arr = [...notes];
    arr.sort((a, b) => {
      const av = new Date(a[sortKey] || a.createdAt).getTime();
      const bv = new Date(b[sortKey] || b.createdAt).getTime();
      return order === "asc" ? av - bv : bv - av;
    });
    return arr;
  }, [notes, sortKey, order]);

  const onUpdated = (updated) => {
    setNotes((prev) => prev.map((n) => (n._id === updated._id ? updated : n)));
  };
  const onDeleted = (id) =>
    setNotes((prev) => prev.filter((n) => n._id !== id));

  const onSearch = async (e) => {
    e.preventDefault();
    await fetchNotes();
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
            <h1 className="font-bold text-lg text-indigo-600">
              Voice Notes AI
            </h1>
            <p className="text-sm text-gray-500">Welcome back!</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium shadow hover:bg-gray-200"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      {/* Recorder + Search */}
      <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-3">
        <Recorder onTranscript={onTranscript} />
        <form
          onSubmit={onSearch}
          className="flex items-center gap-2 w-full md:w-auto"
        >
          <div className="flex items-center gap-2 bg-white shadow rounded-full px-4 py-2 w-full">
            <Search className="text-gray-400 w-4 h-4" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your notes..."
              className="w-full focus:outline-none text-sm"
            />
          </div>
          <button className="px-4 py-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full shadow hover:opacity-90">
            Search
          </button>
        </form>
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

      {/* Sorting */}
      <div className="flex items-center gap-3 mb-6 bg-white shadow rounded-xl px-4 py-2">
        <label className="text-sm font-medium text-gray-600">Sort by:</label>

        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 shadow-sm 
               focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="updatedAt">Updated</option>
          <option value="createdAt">Created</option>
        </select>

        <select
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 shadow-sm 
               focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      {/* Notes */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedFiltered.length === 0 ? (
            <div className="bg-white shadow rounded-xl p-8 text-center col-span-2">
              <Mic className="h-10 w-10 text-purple-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-700">No notes yet</h3>
              <p className="text-gray-500 mb-4">
                Start creating your first voice note! Click the recorder to
                begin.
              </p>
            </div>
          ) : (
            sortedFiltered.map((n) => (
              <NoteCard
                key={n._id}
                note={n}
                onUpdated={onUpdated}
                onDeleted={onDeleted}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
