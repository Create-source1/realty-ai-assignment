import { useEffect, useRef, useState } from "react";
import API from "../api/axiosConfig";
import LoadingSpinner from "./LoadingSpinner";

export default function Recorder({ onTranscript }) {
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    return () => {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        await transcribe(blob);
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert("Mic permission denied or unsupported browser.");
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribe = async (blob) => {
    setLoading(true);
    try {
      const form = new FormData();
      form.append("audio", blob, "note.webm"); // field name expected by backend
      const { data } = await API.post("/ai/transcribe", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onTranscript && onTranscript(data.text || data.transcript || "");
    } catch (e) {
      console.error(e);
      alert("Transcription failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {!isRecording ? (
        <button
          onClick={startRecording}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Start Recording
        </button>
      ) : (
        <button
          onClick={stopRecording}
          className="px-4 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700"
        >
          Stop & Transcribe
        </button>
      )}
      {loading && <LoadingSpinner label="Transcribing..." />}
    </div>
  );
}
