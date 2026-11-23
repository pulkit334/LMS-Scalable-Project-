import { useEffect, useState } from "react";
import {
  X,
  Download,
  Award,
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Clock,
} from "lucide-react";
import { GetAdminStudentPerformance } from "../../../services/Admin/adminapi's";

const TIER_STYLES = {
  Excelling: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  "On Track": "bg-sky-500/15 text-sky-300 border-sky-500/30",
  "Needs Attention": "bg-amber-500/15 text-amber-300 border-amber-500/30",
  "At Risk": "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

const StudentPerformanceModal = ({ studentId, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!studentId) return;
    let active = true;
    setLoading(true);
    setError(null);

    GetAdminStudentPerformance(studentId)
      .then((res) => {
        if (!active) return;
        setData(res?.data || null);
      })
      .catch((err) => {
        if (!active) return;
        setError(err?.response?.data?.message || "Failed to load student analytics");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [studentId]);

  const handleExportReport = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `student-performance-${studentId}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const s = data?.summary;
  const student = data?.student;
  const diff = data?.difficultyMastery;
  const perCourse = data?.perCourse || [];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-[#0d1017] border border-white/10 text-slate-100 shadow-2xl overflow-hidden">
        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-[#11151f] border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/15 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-base font-semibold text-white">
                  {student
                    ? `${student.firstName} ${student.lastName || ""}`
                    : "Student Performance Analytics"}
                </h2>
                {s?.performanceTier && (
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                      TIER_STYLES[s.performanceTier] || TIER_STYLES["On Track"]
                    }`}
                  >
                    {s.performanceTier}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {student?.email || "Statistical Mastery, Z-Score, Volatility & Dropout Risk"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {data && (
              <button
                onClick={handleExportReport}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-medium text-slate-200 cursor-pointer transition"
              >
                <Download className="w-3.5 h-3.5" />
                Export JSON
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Close analytics"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] cursor-pointer transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="py-16 text-center">
              <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-indigo-500 animate-spin mx-auto mb-3" />
              <p className="text-xs text-slate-400">
                Computing statistical performance model...
              </p>
            </div>
          ) : error ? (
            <div className="py-12 text-center text-sm text-rose-400">{error}</div>
          ) : (
            <>
              {/* 6 ULTRA-ADVANCED STATISTICAL KPI CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="rounded-xl bg-[#11151f] border border-white/[0.08] p-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Weighted Mastery Index (M)</span>
                    <TrendingUp className="w-4 h-4 text-indigo-400" />
                  </div>
                  <p className="text-2xl font-semibold text-white mt-2 font-mono tabular-nums">
                    {s.masteryIndex} <span className="text-xs text-slate-500">/ 100</span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Completion {s.overallCompletionPct}% • {s.completedLectures}/{s.totalLectures} lectures
                  </p>
                </div>

                <div className="rounded-xl bg-[#11151f] border border-white/[0.08] p-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Cohort Z-Score &amp; Percentile</span>
                    <Activity className="w-4 h-4 text-sky-400" />
                  </div>
                  <p className="text-2xl font-semibold text-white mt-2 font-mono tabular-nums">
                    {s.zScore >= 0 ? `+${s.zScore}` : s.zScore}σ{" "}
                    <span className="text-xs text-sky-400">
                      ({s.percentileRank}th pct)
                    </span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Cohort μ = {s.cohortMean} • Cohort σ = {s.cohortStdDev}
                  </p>
                </div>

                <div className="rounded-xl bg-[#11151f] border border-white/[0.08] p-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Difficulty-Weighted Quiz</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-2xl font-semibold text-white mt-2 font-mono tabular-nums">
                    {s.weightedQuizAvg !== null ? `${s.weightedQuizAvg}%` : "N/A"}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {s.quizSampleSize} quiz attempt(s){" "}
                    {s.rawQuizAvg !== null ? `• Raw avg ${s.rawQuizAvg}%` : ""}
                  </p>
                </div>

                <div className="rounded-xl bg-[#11151f] border border-white/[0.08] p-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Logistic Dropout Risk (P)</span>
                    <AlertTriangle
                      className={`w-4 h-4 ${
                        s.dropoutRiskPct >= 50 ? "text-rose-400" : "text-emerald-400"
                      }`}
                    />
                  </div>
                  <p className="text-2xl font-semibold text-white mt-2 font-mono tabular-nums">
                    {s.dropoutRiskPct}%
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Inactive {s.daysInactive}d • Enrolled in {s.enrolledCount} course(s)
                  </p>
                </div>

                <div className="rounded-xl bg-[#11151f] border border-white/[0.08] p-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Learning Velocity &amp; ETA</span>
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <p className="text-2xl font-semibold text-white mt-2 font-mono tabular-nums">
                    {s.velocityPerWeek}{" "}
                    <span className="text-xs text-slate-400">lec/wk</span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {s.estimatedDaysToFinish === 0
                      ? "All enrolled courses finished"
                      : s.estimatedDaysToFinish !== null
                        ? `Est. ${s.estimatedDaysToFinish} days to finish`
                        : "Start lectures to estimate ETA"}
                  </p>
                </div>

                <div className="rounded-xl bg-[#11151f] border border-white/[0.08] p-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Quiz Consistency &amp; Volatility</span>
                    <Award className="w-4 h-4 text-amber-400" />
                  </div>
                  <p className="text-2xl font-semibold text-white mt-2 font-mono tabular-nums">
                    {s.consistencyScore !== null ? `${s.consistencyScore}%` : "—"}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    σ = {s.quizVolatilityStdDev} • CV = {s.coefficientOfVariation} •{" "}
                    {s.certificatesEarned} cert(s)
                  </p>
                </div>
              </div>

              {/* DIFFICULTY MASTERY BREAKDOWN */}
              <div className="rounded-xl bg-[#11151f] border border-white/[0.08] p-5">
                <h3 className="text-sm font-semibold text-white mb-4">
                  Conceptual Mastery by Question Difficulty (1.0x / 1.5x / 2.2x)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { key: "EASY", label: "Easy (1.0x)", bar: "bg-emerald-500" },
                    { key: "MEDIUM", label: "Medium (1.5x)", bar: "bg-amber-400" },
                    { key: "HARD", label: "Hard (2.2x)", bar: "bg-rose-500" },
                  ].map((item) => {
                    const stat = diff?.[item.key] || {};
                    const pct = stat.pct ?? 0;
                    return (
                      <div key={item.key} className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-300 font-medium">{item.label}</span>
                          <span className="text-slate-400 font-mono tabular-nums">
                            {stat.total > 0 ? `${stat.correct}/${stat.total} (${pct}%)` : "No data"}
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                          <div
                            className={`h-full rounded-full ${item.bar}`}
                            style={{ width: `${stat.total > 0 ? pct : 0}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* PER-COURSE BREAKDOWN TABLE */}
              <div className="rounded-xl bg-[#11151f] border border-white/[0.08] overflow-hidden">
                <div className="px-5 py-3.5 border-b border-white/[0.08] bg-[#0d1017]">
                  <h3 className="text-sm font-semibold text-white">
                    Per-Course Completion &amp; Assessment Breakdown
                  </h3>
                </div>

                {perCourse.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    This student is not enrolled in any courses yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-white/[0.06] text-slate-400 uppercase tracking-wider">
                          <th className="text-left px-5 py-3">Course</th>
                          <th className="text-center px-4 py-3">Lectures</th>
                          <th className="text-center px-4 py-3">Completion</th>
                          <th className="text-center px-4 py-3">Quiz Avg</th>
                          <th className="text-right px-5 py-3">Certificate</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.05]">
                        {perCourse.map((c) => (
                          <tr key={c.courseId} className="hover:bg-white/[0.02]">
                            <td className="px-5 py-3">
                              <p className="font-medium text-slate-100">{c.courseName}</p>
                              <p className="text-[11px] text-slate-500">{c.category}</p>
                            </td>
                            <td className="px-4 py-3 text-center font-mono tabular-nums text-slate-300">
                              {c.completedLectures}/{c.totalLectures}
                            </td>
                            <td className="px-4 py-3 text-center font-mono tabular-nums text-slate-200">
                              {c.completionPct}%
                            </td>
                            <td className="px-4 py-3 text-center font-mono tabular-nums text-slate-200">
                              {c.weightedQuizScore !== null
                                ? `${c.weightedQuizScore}% (${c.quizAttempts})`
                                : "—"}
                            </td>
                            <td className="px-5 py-3 text-right">
                              {c.certificateEarned ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold">
                                  <Award className="w-3 h-3" /> Earned
                                </span>
                              ) : (
                                <span className="text-slate-500">In Progress</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* FORMULA TRANSPARENCY FOOTNOTE */}
              <div className="rounded-xl bg-[#090b10] border border-white/[0.06] px-4 py-3 text-[11px] text-slate-500 leading-relaxed">
                <strong className="text-slate-400">Statistical Model:</strong>{" "}
                Mastery{" "}
                <code className="text-slate-300">
                  M = 0.45·Completion + 0.40·WeightedQuiz + 0.15·Consistency
                </code>{" "}
                | Consistency{" "}
                <code className="text-slate-300">100 - min(100, (σ/μ)·100)</code>{" "}
                | Z-Score{" "}
                <code className="text-slate-300">(M - μ_cohort) / σ_cohort</code>{" "}
                | Dropout Risk{" "}
                <code className="text-slate-300">1 / (1 + e^-z_risk)</code>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentPerformanceModal;
