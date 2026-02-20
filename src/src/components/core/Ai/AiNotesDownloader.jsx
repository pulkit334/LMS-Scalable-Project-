/* eslint-disable no-unused-vars */
import { useState } from "react";
import {
  DownloadAiNotes,
  GetAiNotes,
} from "../../../services/ai-services/service-ai";
export default function AINotesButton({ subsectionId }) {
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const downloadPDF = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "lecture-notes.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleGenerate = async () => {
    setStatus("loading");
    setMessage("Generating notes, please wait...");

    // Poll every 4 seconds
    const interval = setInterval(async () => {
      try {
        const res = await GetAiNotes(subsectionId);
        console.log("the interval would be ", res);
        if (res.status === "done") {
          clearInterval(interval);

          const blob = await DownloadAiNotes(subsectionId);
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "lecture-notes.pdf");
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);

          setStatus("done");
          setMessage("Notes downloaded!");
        } else if (res.status === "pending") {
          setMessage(res.message || "Still generating...");
        } else if (res.status === "no_transcript") {
          clearInterval(interval);
          setStatus("error");
          setMessage("Transcript not available.");
        }
      } catch (err) {
        clearInterval(interval);
        setStatus("error");
        setMessage("Failed. Please try again.");
      }
    }, 4000);
  };

  const handleReset = () => {
    setStatus("idle");
    setMessage("");
  };

  return (
    <button
      onClick={
        status === "idle" || status === "error" ? handleGenerate : undefined
      }
      className={`
        fixed bottom-7 right-44 z-50
        flex items-center gap-2
        text-white font-bold text-sm
        px-5 py-3 rounded-full
        shadow-lg transition-all duration-300
        ${
          status === "loading"
            ? "bg-indigo-700 cursor-wait animate-pulse"
            : status === "done"
              ? "bg-green-600 cursor-default"
              : status === "error"
                ? "bg-red-600 hover:scale-105"
                : "bg-gradient-to-br from-blue-500 to-indigo-600 hover:scale-105 hover:-translate-y-0.5"
        }
      `}
    >
      {status === "idle" && (
        <>
          <span>📝</span> AI Notes
        </>
      )}
      {status === "loading" && (
        <>
          <span>⏳</span> {message}
        </>
      )}
      {status === "done" && (
        <>
          <span>✅</span> Downloaded!
        </>
      )}
      {status === "error" && (
        <>
          <span>❌</span> Retry
        </>
      )}
    </button>
  );
}
