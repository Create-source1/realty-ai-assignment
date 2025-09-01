import { useEffect, useMemo, useState } from "react";
import API from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";
import Recorder from "../components/Recorder";
import NoteCard from "../components/NoteCard";

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
    <div className="max-w-5xl mx-auto p-4">
      <header className="flex items-center justify-between py-4">
        <h1 className="text-2xl font-bold">Voice Notes</h1>
        <button
          onClick={logout}
          className="text-sm px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
        >
          Logout
        </button>
      </header>

      <div className="bg-white rounded-2xl shadow p-4 mb-4 flex items-center justify-between">
        <Recorder onTranscript={onTranscript} />
        <form onSubmit={onSearch} className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes..."
            className="border rounded-lg p-2 w-56"
          />
          <button className="px-3 py-2 rounded-lg bg-gray-800 text-white">
            Search
          </button>
        </form>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <label className="text-sm">Sort by</label>
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          className="border rounded-lg p-2"
        >
          <option value="updatedAt">Updated</option>
          <option value="createdAt">Created</option>
        </select>
        <select
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className="border rounded-lg p-2"
        >
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
      </div>

      {loading ? (
        <div className="text-gray-600">Loading notes...</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {sortedFiltered.map((n) => (
            <NoteCard
              key={n._id}
              note={n}
              onUpdated={onUpdated}
              onDeleted={onDeleted}
            />
          ))}
          {sortedFiltered.length === 0 && (
            <div className="text-gray-500">No notes found.</div>
          )}
        </div>
      )}
    </div>
  );
}
