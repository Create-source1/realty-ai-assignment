import { useEffect, useState } from "react";

export default function Toast({
  message = "",
  type = "info",
  duration = 2500,
  onClose,
}) {
  const [show, setShow] = useState(Boolean(message));

  useEffect(() => {
    if (!message) return;
    setShow(true);
    const t = setTimeout(() => {
      setShow(false);
      onClose && onClose();
    }, duration);
    return () => clearTimeout(t);
  }, [message, duration, onClose]);

  if (!show) return null;
  const color =
    type === "error"
      ? "bg-red-600"
      : type === "success"
      ? "bg-green-600"
      : "bg-gray-800";

  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 text-white text-sm rounded-md shadow ${color}`}
    >
      {message}
    </div>
  );
}
