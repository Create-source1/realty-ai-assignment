// src/services/api.js
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const register = async (data) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const login = async (data) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const fetchNotes = async (token) => {
  const res = await fetch(`${API_URL}/notes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

// ... more functions like addNote, updateNote, deleteNote, transcribeAudio
