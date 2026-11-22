import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Radio, X } from "lucide-react";
import { useEnrollment } from "../../context/enrollement";
import { useLiveStatus } from "../Custom/useLiveStatus";
import { JoinLiveClass } from "../../services/Live/Live-Services";

const GlobalLiveBanner = () => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { enrolledCourseIds = [] } = useEnrollment() || {};
  const location = useLocation();
  const navigate = useNavigate();

  const isStudent = token && user?.accountType?.toLowerCase() === "student";
  const isOnLiveRoute = location.pathname.startsWith("/live/");
  const liveMap = useLiveStatus(isStudent ? enrolledCourseIds : []);
  const [dismissedIds, setDismissedIds] = useState({});
  const [joining, setJoining] = useState(false);

  const liveEntries = Object.values(liveMap || {}).filter(
    (item) => item?.classId && !dismissedIds[item.classId]
  );

  // Clean up dismissed IDs if class ends
  useEffect(() => {
    const activeIds = new Set(Object.values(liveMap || {}).map((i) => i.classId));
    setDismissedIds((prev) => {
      const next = {};
      Object.keys(prev).forEach((k) => {
        if (activeIds.has(k)) next[k] = true;
      });
      return next;
    });
  }, [liveMap]);

  if (!isStudent || isOnLiveRoute || liveEntries.length === 0) return null;

  const activeClass = liveEntries[0];

  const handleJoin = async () => {
    setJoining(true);
    try {
      const data = await JoinLiveClass(activeClass.classId);
      if (data?.token && data?.host) {
        navigate(`/live/${activeClass.classId}/watch`, {
          state: { token: data.token, host: data.host },
        });
      }
    } catch (err) {
      toast.error(err?.message || "Failed to join live class");
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-sm rounded-2xl bg-[#0f172a]/95 backdrop-blur-md border border-rose-500/40 shadow-2xl shadow-black/70 p-4 text-white">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
                Instructor is Live
              </span>
            </div>
            <p className="text-sm font-semibold text-white mt-0.5 line-clamp-1">
              {activeClass.title || "Live Session Started"}
            </p>
            <div className="flex items-center gap-2 mt-2.5">
              <button
                onClick={handleJoin}
                disabled={joining}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-xs font-semibold text-white transition cursor-pointer"
              >
                {joining ? "Joining..." : "Join Live Class"}
              </button>
              {liveEntries.length > 1 && (
                <span className="text-[11px] text-slate-400">
                  +{liveEntries.length - 1} more
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() =>
            setDismissedIds((prev) => ({
              ...prev,
              [activeClass.classId]: true,
            }))
          }
          aria-label="Dismiss live alert"
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default GlobalLiveBanner;
