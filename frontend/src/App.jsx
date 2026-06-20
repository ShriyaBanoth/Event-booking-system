import { useEffect, useState } from "react";
import api from "./api/axios";

function App() {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    api
      .get("/health")
      .then(() => setStatus("connected"))
      .catch(() => setStatus("disconnected"));
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Event Booking System
        </h1>
        <p className="text-gray-500 mb-6">Phase 1 — Project Setup &amp; Architecture</p>

        <div className="flex items-center justify-center gap-2 mb-4">
          <span
            className={`inline-block w-2.5 h-2.5 rounded-full ${
              status === "connected"
                ? "bg-green-500"
                : status === "checking"
                ? "bg-yellow-400"
                : "bg-red-500"
            }`}
          />
          <span className="text-sm font-medium text-gray-700">
            Backend status:{" "}
            {status === "checking"
              ? "Checking..."
              : status === "connected"
              ? "Connected"
              : "Not reachable"}
          </span>
        </div>

        <p className="text-xs text-gray-400">
          React + Vite + Tailwind frontend wired to Express backend via /api proxy.
        </p>
      </div>
    </div>
  );
}

export default App;
