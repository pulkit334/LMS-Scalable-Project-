  import { useState, useEffect } from "react";
  import { GetAiQuestions } from "../../../services/ai-services/service-ai.js";

  const DIFF_STYLE = {
    EASY:   "bg-green-900 text-green-400 border border-green-800",
    MEDIUM: "bg-yellow-900 text-yellow-400 border border-yellow-800",
    HARD:   "bg-red-900 text-red-400 border border-red-800",
  };

  export default function AIQuizButton({ subsectionId }) {
    const [open, setOpen]                       = useState(false);
    const [questions, setQuestions]             = useState([]);
    const [loading, setLoading]                 = useState(false);
    const [selected, setSelected]               = useState({});
    const [submitted, setSubmitted]             = useState(false);
    const [showExplanation, setShowExplanation] = useState({});
    const [pulse, setPulse]                     = useState(true);
    const [error, setError]                     = useState(null);

  //Fetch the questions when ever the pannel opens 
    useEffect(() => {
      if (!open || questions.length > 0) return;

      const fetchQuestions = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await GetAiQuestions(subsectionId);
          setQuestions(data);
        } catch (err) {
          console.error("Failed to fetch questions", err);
          setError("Failed to load questions. Please try again.");
        } finally {
          setLoading(false);
        }
      };

      fetchQuestions();
    }, [open, subsectionId]);

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
        {/* ── Floating Button ── */}
        {!open && (
          <button
            onClick={() => { setOpen(true); setPulse(false); }}
            className={`
              fixed bottom-7 right-7 z-50
              flex items-center gap-2
              bg-gradient-to-br from-yellow-400 to-orange-500
              text-black font-bold text-sm
              px-5 py-3 rounded-full
              shadow-lg shadow-yellow-400/40
              transition-all duration-300
              hover:scale-105 hover:-translate-y-0.5 hover:shadow-yellow-400/60
              ${pulse ? "animate-pulse" : ""}
            `}
          >
            <span className="text-lg">🤖</span>
            AI Quiz
          </button>
        )}

        {/* ── Backdrop ── */}
        {open && (
          <div
            className="fixed inset-0 bg-black/55 z-40"
            onClick={() => setOpen(false)}
          />
        )}

        {/* ── Side Panel ── */}
        {open && (
          <div className="fixed bottom-0 right-0 z-50 w-[420px] max-w-full h-[88vh] max-h-[680px] flex flex-col bg-[#161D29] border border-[#2C333F] rounded-tl-2xl shadow-2xl overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#1C2434] border-b border-[#2C333F] flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xl">🤖</span>
                <h2 className="text-white font-bold text-base m-0">AI Quiz</h2>
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">
                  Auto Generated
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full bg-[#2C333F] text-[#AFB2BF] hover:bg-[#3D4451] hover:text-white transition-all flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            {/* Score Bar */}
            {submitted && (
              <div className="flex items-center justify-between px-6 py-3 bg-green-950 border-b border-green-800 flex-shrink-0">
                <div>
                  <p className="text-green-400 font-bold text-sm m-0">
                    {score}/{questions.length} Correct 🎉
                  </p>
                  <p className="text-green-300 text-xs mt-0.5 m-0">
                    {score === questions.length
                      ? "Perfect score! Excellent work."
                      : score >= Math.ceil(questions.length / 2)
                      ? "Good job! Review the wrong answers."
                      : "Keep practicing — you've got this!"}
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="bg-green-900 border border-green-400 text-green-400 hover:bg-green-400 hover:text-black text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                >
                  ↺ Retry
                </button>
              </div>
            )}

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 scrollbar-thin scrollbar-thumb-[#2C333F]">

              {/* Loading */}
              {loading && (
                <div className="flex flex-col items-center justify-center h-48 gap-4 text-[#6B7280] text-sm">
                  <div className="w-8 h-8 border-[3px] border-[#2C333F] border-t-yellow-400 rounded-full animate-spin" />
                  <span>Loading questions...</span>
                </div>
              )}

              {/* Error */}
              {!loading && error && (
                <div className="flex flex-col items-center justify-center h-48 gap-3 text-sm">
                  <span className="text-3xl">⚠️</span>
                  <p className="text-red-400 text-center">{error}</p>
                  <button
                    onClick={() => { setQuestions([]); setError(null); setOpen(false); setTimeout(() => setOpen(true), 100); }}
                    className="text-yellow-400 underline text-xs"
                  >
                    Try again
                  </button>
                </div>
              )}

              {/* Empty */}
              {!loading && !error && questions.length === 0 && (
                <div className="flex flex-col items-center justify-center h-48 gap-2 text-[#6B7280] text-sm">
                  <span className="text-3xl">📭</span>
                  <span>No questions available yet.</span>
                </div>
              )}

              {/* Questions */}
              {!loading && !error && questions.map((q, idx) => {
                const userAns   = selected[q._id];
                const correct   = q.answer;
                const diffClass = DIFF_STYLE[q.difficulty] || DIFF_STYLE.EASY;

                return (
                  <div
                    key={q._id}
                    className="bg-[#1C2434] border border-[#2C333F] rounded-xl p-4 mb-3"
                  >
                    {/* Meta row */}
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="font-mono text-[11px] text-[#6B7280] uppercase tracking-wide">
                        Q{idx + 1}
                      </span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${diffClass}`}>
                        {q.difficulty}
                      </span>
                    </div>

                    {/* Question text */}
                    <p className="text-white text-[13.5px] font-semibold leading-relaxed mb-3 m-0">
                      {q.question}
                    </p>

                    {/* Options */}
                    <div className="flex flex-col gap-2 mt-3">
                      {q.options.map((opt, i) => {
                        let cls = "flex items-center gap-3 px-3 py-2.5 w-full text-left text-sm rounded-lg border-[1.5px] transition-all duration-150 ";
                        let icon = "";

                        if (submitted) {
                          if (opt === correct) {
                            cls += "bg-green-950 border-green-400 text-green-400 cursor-default";
                            icon = "✓";
                          } else if (opt === userAns) {
                            cls += "bg-red-950 border-red-400 text-red-400 cursor-default";
                            icon = "✗";
                          } else {
                            cls += "bg-[#161D29] border-[#2C333F] text-[#6B7280] cursor-default";
                          }
                        } else if (opt === userAns) {
                          cls += "bg-yellow-950 border-yellow-400 text-yellow-400 cursor-pointer";
                          icon = "●";
                        } else {
                          cls += "bg-[#161D29] border-[#2C333F] text-[#AFB2BF] hover:border-yellow-400 hover:bg-[#1e2535] hover:text-white cursor-pointer";
                        }

                        return (
                          <button key={i} className={cls} onClick={() => handleSelect(q._id, opt)}>
                            <span className="w-[17px] h-[17px] rounded-full border-2 border-current flex-shrink-0 flex items-center justify-center text-[9px] font-bold">
                              {icon}
                            </span>
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation toggle */}
                    {submitted && (
                      <>
                        <button
                          className="text-[#6B7280] hover:text-yellow-400 text-xs underline mt-2 transition-colors bg-transparent border-none cursor-pointer p-0"
                          onClick={() => setShowExplanation(p => ({ ...p, [q._id]: !p[q._id] }))}
                        >
                          {showExplanation[q._id] ? "▲ Hide" : "▼ Show"} explanation
                        </button>
                        {showExplanation[q._id] && (
                          <div className="mt-2.5 px-3 py-2.5 bg-[#161D29] border-l-[3px] border-yellow-400 rounded-r-lg text-[#AFB2BF] text-xs leading-relaxed">
                            <strong className="text-yellow-400 text-[10px] uppercase tracking-wide block mb-1">
                              💡 Explanation
                            </strong>
                            {q.explanation}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            {!submitted && !loading && !error && questions.length > 0 && (
              <div className="px-5 py-4 border-t border-[#2C333F] bg-[#1C2434] flex-shrink-0">
                <button
                  onClick={handleSubmit}
                  disabled={answeredCount < questions.length}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-sm py-3 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-yellow-400/30 disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  Submit Answers
                </button>
                <p className="text-center text-[#6B7280] text-xs mt-2 m-0">
                  {answeredCount}/{questions.length} answered
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
