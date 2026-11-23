const BAR_COLORS = [
  "bg-indigo-500",
  "bg-emerald-500",
  "bg-amber-400",
  "bg-sky-400",
];

export default function TopCoursesProgress({ data = [] }) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-xs text-slate-500 py-8">
        No category enrollment data available
      </div>
    );
  }

  const max = Math.max(...data.map((d) => d.totalEnrollments || 0), 1);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-100">
          Top Categories by Enrollment
        </h3>
        <span className="text-[11px] text-slate-500">Enrollments</span>
      </div>

      <div className="space-y-3.5">
        {data.map((item, index) => {
          const percent = Math.min(
            100,
            Math.round(((item.totalEnrollments || 0) / max) * 100)
          );
          const colorClass = BAR_COLORS[index % BAR_COLORS.length];

          return (
            <div key={`${item.categoryId || item.categoryName}-${index}`}>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-200 font-medium truncate pr-3">
                  {item.categoryName}
                </span>
                <span className="text-slate-400 font-mono tabular-nums">
                  {item.totalEnrollments || 0}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className={`h-full rounded-full ${colorClass} transition-all duration-500`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
