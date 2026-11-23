import { useState, useEffect, useRef } from "react";
import { FileText, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import {
  DownloadAiNotes,
  GetAiNotes,
} from "../../../services/ai-services/service-ai";

const MAX_POLL_ATTEMPTS = 30; // ~2 minutes max polling

export default function AINotesButton({ subsectionId }) {
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const intervalRef = useRef(null);

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Reset state & stop polling when navigating to another lecture or unmounting
  useEffect(() => {
    stopPolling();
    setStatus("idle");
    setMessage("");
    return () => stopPolling();
  }, [subsectionId]);

  const triggerDownload = async () => {
    const blob = await DownloadAiNotes(subsectionId);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "lecture-notes.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleGenerate = async () => {
    stopPolling();
    setStatus("loading");
    setMessage("Preparing AI notes...");

    let attempts = 0;

    const checkOnce = async () => {
      attempts += 1;
      try {
        const res = await GetAiNotes(subsectionId);

        if (res.status === "done") {
          stopPolling();
          setMessage("Downloading PDF...");
          await triggerDownload();
          setStatus("done");
          setMessage("Notes Ready");
          return true;
        }

        if (res.status === "pending") {
          setMessage(res.message || "Generating AI notes...");
          if (attempts >= MAX_POLL_ATTEMPTS) {
            stopPolling();
            setStatus("error");
            setMessage("Timed out — Retry");
            return true;
          }
          return false;
        }

        // Handles "no_transcript", "failed", or any unexpected non-pending state
        stopPolling();
        setStatus("error");
        setMessage(res.message || "Retry AI Notes");
        return true;
      } catch (err) {
        stopPolling();
        setStatus("error");
        setMessage("Failed — Retry");
        return true;
      }
    };

    // Check immediately instead of waiting 4 seconds first
    const finished = await checkOnce();
    if (!finished) {
      intervalRef.current = setInterval(checkOnce, 4000);
    }
  };

  return (
    <button
      onClick={status !== "loading" ? handleGenerate : undefined}
      title={status === "done" ? "Click to download again" : "Generate & download AI study notes PDF"}
      className={`
        fixed bottom-6 right-40 z-50
        flex items-center gap-2
        text-white font-semibold text-sm
        px-5 py-2.5 rounded-full
        shadow-lg border transition-all duration-200
        ${
          status === "loading"
            ? "bg-indigo-700/90 border-indigo-400/30 cursor-wait"
            : status === "done"
              ? "bg-emerald-600 border-emerald-400/40 hover:bg-emerald-500 cursor-pointer"
              : status === "error"
                ? "bg-rose-600 border-rose-400/40 hover:bg-rose-500 cursor-pointer"
                : "bg-gradient-to-r from-indigo-600 to-blue-600 border-indigo-400/30 shadow-indigo-600/25 hover:scale-[1.03] hover:-translate-y-0.5 hover:shadow-indigo-500/40 cursor-pointer"
        }
      `}
    >
      {status === "idle" && (
        <>
          <FileText className="w-4 h-4" />
          <span>AI Notes</span>
        </>
      )}
      {status === "loading" && (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{message}</span>
        </>
      )}
      {status === "done" && (
        <>
          <CheckCircle2 className="w-4 h-4" />
          <span>{message || "Downloaded"}</span>
        </>
      )}
      {status === "error" && (
        <>
          <AlertCircle className="w-4 h-4" />
          <span>{message || "Retry"}</span>
        </>
      )}
    </button>
  );
}
