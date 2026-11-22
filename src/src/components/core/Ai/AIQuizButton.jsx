import { useState, useEffect, useCallback, useRef } from "react";
import {
  Sparkles,
  X,
  RotateCcw,
  Check,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  BookOpenCheck,
  Loader2,
} from "lucide-react";
import { GetAiQuestions } from "../../../services/ai-services/service-ai.js";

const DIFF_STYLE = {
  EASY: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
  MEDIUM: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
  HARD: "bg-rose-500/15 text-rose-300 border border-rose-500/30",
};

export default function AIQuizButton({ subsectionId }) {
  const [open, setOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [selected, setSelected] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState({});
  const [error, setError] = useState(null);
  const retryTimerRef = useRef(null);

  // Reset quiz state whenever the user navigates to a different lecture
  useEffect(() => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    setQuestions([]);
    setSelected({});
    setSubmitted(false);
    setShowExplanation({});
    setError(null);
    setStatusMessage("");
    setLoading(false);
  }, [subsectionId]);

  useEffect(() => {
    return () => {
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    };
  }, []);

  const fetchQuestions = useCallback(async () => {
    if (!subsectionId) return;
    setLoading(true);
    setError(null);
    setStatusMessage("Loading conceptual quiz...");

    try {
      const res = await GetAiQuestions(subsectionId);

      if (res.status === "transcribing") {
        setStatusMessage(
          res.message || "Transcribing lecture audio... checking again shortly."
        );
        retryTimerRef.current = setTimeout(() => {
          fetchQuestions();
        }, 6000);
        return;
      }

      setQuestions(res.data || []);
      setStatusMessage("");
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch questions", err);
      const serverMsg = err?.response?.data?.message;
      setError(serverMsg || "Failed to load questions. Please try again.");
      setStatusMessage("");
      setLoading(false);
    }
  }, [subsectionId]);

  // Fetch questions whenever the panel opens and hasn't loaded yet
  useEffect(() => {
    if (!open || questions.length > 0 || loading) return;
    fetchQuestions();
  }, [open, subsectionId, questions.length, loading, fetchQuestions]);

  const handleSelect = (qId, option) => {
    if (submitted) return;
    setSelected((prev) => ({ ...prev, [qId]: option }));
  };

  const handleSubmit = () => {
    if (Object.keys(selected).length < questions.length) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setSelected({});
    setSubmitted(false);
    setShowExplanation({});
  };

  const score = submitted
    ? questions.filter((q) => selected[q._id] === q.answer).length
    : 0;

  const answeredCount = Object.keys(selected).length;

  return (
    <div>
      {/* Floating Trigger Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-semibold text-sm px-5 py-2.5 rounded-full shadow-lg shadow-amber-500/25 border border-amber-300/40 transition-all duration-200 hover:scale-[1.03] hover:-translate-y-0.5 hover:shadow-amber-500/40 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Quiz</span>
        </button>
      )}

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Side Drawer Panel */}
      {open && (
        <div className="fixed bottom-0 right-0 z-50 w-[440px] max-w-full h-[88vh] max-h-[720px] flex flex-col bg-[#0c1324] border-l border-t border-white/10 rounded-tl-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-[#11192e] border-b border-white/10 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400">
                <BookOpenCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-slate-100 font-semibold text-sm m-0 tracking-tight">
                    AI Concept Quiz
                  </h2>
                  <span className="bg-amber-400/15 text-amber-300 border border-amber-400/30 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    AI
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 m-0">
                  Test your understanding of this lecture
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close AI Quiz"
              className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white transition-colors flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Score Banner */}
          {submitted && (
            <div className="flex items-center justify-between px-6 py-3.5 bg-emerald-950/60 border-b border-emerald-500/25 flex-shrink-0">
              <div>
                <p className="text-emerald-300 font-semibold text-sm m-0">
                  Score: {score} / {questions.length} (
                  {Math.round((score / Math.max(questions.length, 1)) * 100)}%)
                </p>
                <p className="text-emerald-200/75 text-xs mt-0.5 m-0">
                  {score === questions.length
                    ? "Mastery achieved — every answer is right."
                    : score >= Math.ceil(questions.length / 2)
                      ? "Solid progress! Review explanations below."
                      : "Keep practicing — check the explanations to lock in concepts."}
                </p>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 hover:bg-emerald-400 hover:text-slate-950 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Retry
              </button>
            </div>
          )}

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3.5">
            {/* Loading / Transcribing */}
            {loading && (
              <div className="flex flex-col items-center justify-center h-56 gap-3.5 text-slate-400 text-sm text-center px-6">
                <Loader2 className="w-7 h-7 text-amber-400 animate-spin" />
                <p className="m-0 text-slate-300 font-medium">
                  {statusMessage || "Preparing AI questions..."}
                </p>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="flex flex-col items-center justify-center h-56 gap-3 text-sm px-6 text-center">
                <div className="w-11 h-11 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <p className="text-rose-300 m-0 leading-relaxed">{error}</p>
                <button
                  onClick={fetchQuestions}
                  className="mt-1 px-4 py-1.5 rounded-lg bg-white/5 border border-white/15 text-amber-300 hover:bg-white/10 text-xs font-medium transition-colors cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Empty */}
            {!loading && !error && questions.length === 0 && (
              <div className="flex flex-col items-center justify-center h-56 gap-2 text-slate-400 text-sm">
                <span>No questions available for this lecture yet.</span>
                <button
                  onClick={fetchQuestions}
                  className="text-amber-400 hover:underline text-xs cursor-pointer bg-transparent border-none"
                >
                  Generate Now
                </button>
              </div>
            )}

            {/* Question Cards */}
            {!loading &&
              !error &&
              questions.map((q, idx) => {
                const userAns = selected[q._id];
                const correct = q.answer;
                const diffClass = DIFF_STYLE[q.difficulty] || DIFF_STYLE.MEDIUM;

                return (
                  <div
                    key={q._id || idx}
                    className="bg-[#121b30] border border-white/[0.08] rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="font-mono text-[11px] text-slate-400 uppercase tracking-wider">
                        Question {idx + 1}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${diffClass}`}
                      >
                        {q.difficulty || "MEDIUM"}
                      </span>
                    </div>

                    <p className="text-slate-100 text-[13.5px] font-medium leading-relaxed mb-3 m-0">
                      {q.question}
                    </p>

                    <div className="flex flex-col gap-2">
                      {(q.options || []).map((opt, i) => {
                        let cls =
                          "flex items-center gap-3 px-3.5 py-2.5 w-full text-left text-[13px] rounded-lg border transition-all duration-150 ";
                        let badge = String.fromCharCode(65 + i);

                        if (submitted) {
                          if (opt === correct) {
                            cls +=
                              "bg-emerald-950/60 border-emerald-400/70 text-emerald-300 cursor-default";
                            badge = "✓";
                          } else if (opt === userAns) {
                            cls +=
                              "bg-rose-950/60 border-rose-400/70 text-rose-300 cursor-default";
                            badge = "✕";
                          } else {
                            cls +=
                              "bg-[#0c1324] border-white/[0.06] text-slate-500 cursor-default";
                          }
                        } else if (opt === userAns) {
                          cls +=
                            "bg-amber-500/15 border-amber-400 text-amber-200 cursor-pointer";
                        } else {
                          cls +=
                            "bg-[#0c1324] border-white/[0.08] text-slate-300 hover:border-amber-400/50 hover:bg-[#16213a] hover:text-white cursor-pointer";
                        }

                        return (
                          <button
                            key={i}
                            className={cls}
                            onClick={() => handleSelect(q._id, opt)}
                          >
                            <span className="w-5 h-5 rounded-md border border-current/40 flex-shrink-0 flex items-center justify-center text-[10px] font-bold">
                              {badge}
                            </span>
                            <span className="leading-snug">{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {submitted && q.explanation && (
                      <div className="mt-3">
                        <button
                          className="inline-flex items-center gap-1 text-slate-400 hover:text-amber-300 text-xs font-medium transition-colors bg-transparent border-none cursor-pointer p-0"
                          onClick={() =>
                            setShowExplanation((p) => ({
                              ...p,
                              [q._id]: !p[q._id],
                            }))
                          }
                        >
                          {showExplanation[q._id] ? (
                            <>
                              <ChevronUp className="w-3.5 h-3.5" /> Hide explanation
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-3.5 h-3.5" /> View explanation
                            </>
                          )}
                        </button>
                        {showExplanation[q._id] && (
                          <div className="mt-2.5 px-3.5 py-3 bg-[#0a1020] border-l-2 border-amber-400 rounded-r-lg text-slate-300 text-xs leading-relaxed">
                            <div className="flex items-center gap-1.5 text-amber-300 text-[10px] font-semibold uppercase tracking-wider mb-1">
                              <Lightbulb className="w-3.5 h-3.5" />
                              Explanation
                            </div>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>

          {/* Footer */}
          {!submitted && !loading && !error && questions.length > 0 && (
            <div className="px-5 py-4 border-t border-white/10 bg-[#11192e] flex-shrink-0">
              <button
                onClick={handleSubmit}
                disabled={answeredCount < questions.length}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-semibold text-sm py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/25 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer"
              >
                <Check className="w-4 h-4" />
                Submit Answers ({answeredCount}/{questions.length})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
