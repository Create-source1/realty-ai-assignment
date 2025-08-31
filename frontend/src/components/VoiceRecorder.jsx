import React, { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Mic,
  MicOff,
  Square,
  Upload,
  X,
  Loader2,
  Volume2,
  Play,
  Pause,
} from "lucide-react";
import { api } from "../api/axiosConfig";
import { toast } from "sonner";

const VoiceRecorder = ({ onNoteCreated, onClose }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [creating, setCreating] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState("");

  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/wav" });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioURL(url);

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setError("");

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      setError(
        "Microphone access denied. Please allow microphone access to record."
      );
      console.error("Error accessing microphone:", err);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
        // Resume timer
        timerRef.current = setInterval(() => {
          setRecordingTime((prev) => prev + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
        // Pause timer
        clearInterval(timerRef.current);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      clearInterval(timerRef.current);
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
        audioRef.current.onended = () => setIsPlaying(false);
      }
    }
  };

  const transcribeAndCreate = async () => {
    if (!audioBlob) return;

    setTranscribing(true);
    setError("");

    try {
      // Transcribe audio
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.wav");

      const transcriptResponse = await api.post("/transcribe", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const transcript = transcriptResponse.data.transcript;

      setTranscribing(false);
      setCreating(true);

      // Create note with transcript
      const noteResponse = await api.post("/notes", {
        transcript: transcript,
      });

      onNoteCreated(noteResponse.data);
      toast.success("Voice note created and transcribed successfully!");
    } catch (err) {
      setError("Failed to transcribe audio. Please try again.");
      console.error("Transcription error:", err);
      toast.error("Failed to create voice note");
    } finally {
      setTranscribing(false);
      setCreating(false);
    }
  };

  const resetRecording = () => {
    setAudioURL(null);
    setAudioBlob(null);
    setRecordingTime(0);
    setError("");
    chunksRef.current = [];
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md glass-container border-0 shadow-2xl scale-in">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold text-gray-800">
              Voice Recorder
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="hover:bg-gray-100 rounded-full p-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-600">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Recording Status */}
          <div className="text-center">
            {isRecording && (
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-600 font-medium">
                  {isPaused ? "Paused" : "Recording"}
                </span>
                <Badge
                  variant="outline"
                  className="bg-red-50 text-red-600 border-red-200"
                >
                  {formatTime(recordingTime)}
                </Badge>
              </div>
            )}

            {audioURL && !isRecording && (
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Volume2 className="h-4 w-4 text-green-600" />
                <span className="text-green-600 font-medium">
                  Recording Complete
                </span>
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-600 border-green-200"
                >
                  {formatTime(recordingTime)}
                </Badge>
              </div>
            )}
          </div>

          {/* Recording Controls */}
          <div className="flex justify-center space-x-4">
            {!isRecording && !audioURL && (
              <Button
                onClick={startRecording}
                className="btn-primary flex items-center space-x-2 px-8 py-3"
              >
                <Mic className="h-5 w-5" />
                <span>Start Recording</span>
              </Button>
            )}

            {isRecording && (
              <>
                <Button
                  onClick={pauseRecording}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  {isPaused ? (
                    <Play className="h-4 w-4" />
                  ) : (
                    <Pause className="h-4 w-4" />
                  )}
                  <span>{isPaused ? "Resume" : "Pause"}</span>
                </Button>

                <Button
                  onClick={stopRecording}
                  className="bg-red-600 hover:bg-red-700 text-white flex items-center space-x-2"
                >
                  <Square className="h-4 w-4" />
                  <span>Stop</span>
                </Button>
              </>
            )}
          </div>

          {/* Audio Playback */}
          {audioURL && !isRecording && (
            <div className="space-y-4">
              <audio ref={audioRef} src={audioURL} className="w-full" />

              <div className="flex justify-center space-x-4">
                <Button
                  onClick={playAudio}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  <span>{isPlaying ? "Pause" : "Play"}</span>
                </Button>

                <Button
                  onClick={resetRecording}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <MicOff className="h-4 w-4" />
                  <span>Record Again</span>
                </Button>
              </div>

              {/* Create Note Button */}
              <Button
                onClick={transcribeAndCreate}
                disabled={transcribing || creating}
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                {transcribing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Transcribing...</span>
                  </>
                ) : creating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Creating Note...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span>Create Note</span>
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Instructions */}
          {!isRecording && !audioURL && (
            <div className="text-center text-sm text-gray-600 space-y-2">
              <p>Click "Start Recording" to begin capturing your voice note.</p>
              <p className="text-xs">
                Make sure your microphone is connected and permissions are
                granted.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceRecorder;
