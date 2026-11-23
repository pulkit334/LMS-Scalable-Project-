/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useTracks,
  useLocalParticipant,
  useParticipants,
  useDataChannel,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  MonitorOff,
  PhoneOff,
  MessageSquare,
  Users,
  Radio,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  Clock,
  Lock,
  Unlock,
  VolumeX,
  Maximize,
  Minimize,
  Hand,
} from "lucide-react";
import {
  StartLiveClass,
  EndLiveClass,
  MuteAllStudentsAPI,
  UpdateRoomSettingsAPI,
} from "../../services/Live/Live-Services";
import LiveChatPanel from "./LiveChatPanel";

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const REACTIONS = ["👍", "👏", "❤️", "🔥", "🎉"];

const formatDuration = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return hrs > 0 ? `${pad(hrs)}:${pad(mins)}:${pad(secs)}` : `${pad(mins)}:${pad(secs)}`;
};

const TeacherRoom = ({ classId, onRequestEnd, elapsedSeconds }) => {
  const { localParticipant } = useLocalParticipant();
  const participants = useParticipants();
  const tracks = useTracks([Track.Source.Camera, Track.Source.ScreenShare]);

  const cameraTrack = tracks.find(
    (t) => t.participant.isLocal && t.source === Track.Source.Camera
  );
  const screenTrack = tracks.find(
    (t) => t.participant.isLocal && t.source === Track.Source.ScreenShare
  );
  const studentCameraTracks = tracks.filter(
    (t) => !t.participant.isLocal && t.source === Track.Source.Camera
  );

  const stageRef = useRef(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);
  const [chatLocked, setChatLocked] = useState(false);
  const [mutingAll, setMutingAll] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [raisedHands, setRaisedHands] = useState({});
  const [reports, setReports] = useState([]);
  const [floatingReactions, setFloatingReactions] = useState([]);

  const spawnReaction = (emoji, senderName) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setFloatingReactions((prev) => [...prev.slice(-12), { id, emoji, senderName }]);
    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== id));
    }, 2400);
  };

  useDataChannel("classroom-events", (msg) => {
    try {
      const data = JSON.parse(decoder.decode(msg.payload));
      if (data.type === "hand_raise") {
        setRaisedHands((prev) => {
          const next = { ...prev };
          if (data.raised) {
            next[data.identity] = data.name || "Student";
            toast(`${data.name || "A student"} raised their hand`, { icon: "✋" });
          } else {
            delete next[data.identity];
          }
          return next;
        });
      } else if (data.type === "reaction") {
        spawnReaction(data.emoji, data.name);
      }
    } catch (_) {}
  });

  const publishEvent = async (payload) => {
    if (!localParticipant) return;
    await localParticipant.publishData(encoder.encode(JSON.stringify(payload)), {
      reliable: true,
      topic: "classroom-events",
    });
  };

  const toggleMic = async () => {
    await localParticipant.setMicrophoneEnabled(!micOn);
    setMicOn((prev) => !prev);
  };

  const toggleCam = async () => {
    await localParticipant.setCameraEnabled(!camOn);
    setCamOn((prev) => !prev);
  };

  const toggleScreen = async () => {
    await localParticipant.setScreenShareEnabled(!sharing);
    setSharing((prev) => !prev);
  };

  const handleMuteAll = async () => {
    setMutingAll(true);
    try {
      const res = await MuteAllStudentsAPI(classId);
      setRaisedHands({});
      toast.success(`Muted all students (${res?.mutedCount ?? 0})`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to mute all students");
    } finally {
      setMutingAll(false);
    }
  };

  const handleToggleChatLock = async () => {
    const nextLocked = !chatLocked;
    try {
      await UpdateRoomSettingsAPI(classId, { chatLocked: nextLocked });
      setChatLocked(nextLocked);
      await publishEvent({ type: "chat_lock", locked: nextLocked });
      toast.success(nextLocked ? "Student chat locked" : "Student chat unlocked");
    } catch (err) {
      toast.error("Failed to update chat lock setting");
    }
  };

  const handleReactionClick = async (emoji) => {
    spawnReaction(emoji, "You");
    try {
      await publishEvent({
        type: "reaction",
        emoji,
        name: localParticipant?.name || "Instructor",
      });
    } catch (_) {}
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      stageRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const studentCount = Math.max(0, participants.length - 1);
  const raisedCount = Object.keys(raisedHands).length;

  return (
    <div ref={stageRef} className="flex-1 flex flex-col min-h-0 bg-[#020617]">
      {/* TOP BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 bg-[#0f172a] border-b border-white/10">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 bg-rose-500/15 border border-rose-500/30 px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-rose-400 text-xs font-bold uppercase tracking-wider">
              Live
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-white/[0.05] border border-white/10 px-3 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono">{formatDuration(elapsedSeconds)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-white/[0.05] border border-white/10 px-3 py-1 rounded-full">
            <Users className="w-3.5 h-3.5 text-sky-400" />
            <span>
              {studentCount} {studentCount === 1 ? "student" : "students"}
            </span>
          </div>
          {raisedCount > 0 && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300 bg-amber-400/15 border border-amber-400/30 px-3 py-1 rounded-full animate-pulse">
              <Hand className="w-3.5 h-3.5" />
              <span>{raisedCount} hand raised</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleMuteAll}
            disabled={mutingAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.05] border border-white/10 text-slate-200 hover:bg-rose-500/20 hover:border-rose-500/30 hover:text-rose-200 transition cursor-pointer"
          >
            <VolumeX className="w-3.5 h-3.5" />
            {mutingAll ? "Muting..." : "Mute All"}
          </button>

          <button
            onClick={handleToggleChatLock}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
              chatLocked
                ? "bg-rose-500/15 border-rose-500/30 text-rose-300"
                : "bg-white/[0.05] border-white/10 text-slate-200 hover:text-white"
            }`}
          >
            {chatLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            {chatLocked ? "Chat Locked" : "Lock Chat"}
          </button>

          <button
            onClick={toggleFullscreen}
            title="Toggle fullscreen"
            className="p-2 rounded-xl bg-white/[0.05] border border-white/10 text-slate-300 hover:text-white transition cursor-pointer"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setChatOpen((prev) => !prev)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
              chatOpen
                ? "bg-amber-400/15 border-amber-400/40 text-amber-300"
                : "bg-white/[0.05] border-white/10 text-slate-300 hover:text-white"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Classroom
          </button>
        </div>
      </div>

      {/* MAIN STAGE + SIDEBAR */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          {/* VIDEO VIEW */}
          <div className="flex-1 relative bg-black flex items-center justify-center min-h-[280px]">
            {screenTrack ? (
              <video
                ref={(el) => {
                  if (el && screenTrack.publication?.track)
                    screenTrack.publication.track.attach(el);
                }}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-contain"
              />
            ) : cameraTrack ? (
              <video
                ref={(el) => {
                  if (el && cameraTrack.publication?.track)
                    cameraTrack.publication.track.attach(el);
                }}
                style={{ transform: "scaleX(-1)" }}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-500">
                <VideoOff className="w-10 h-10 opacity-40" />
                <p className="text-sm">Camera is turned off</p>
              </div>
            )}

            {/* PIP camera when screen sharing */}
            {screenTrack && cameraTrack && (
              <div className="absolute bottom-4 right-4 w-44 h-32 rounded-xl overflow-hidden border border-white/20 shadow-2xl bg-black">
                <video
                  ref={(el) => {
                    if (el && cameraTrack.publication?.track)
                      cameraTrack.publication.track.attach(el);
                  }}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Floating Live Reactions */}
            <div className="pointer-events-none absolute bottom-5 left-5 flex flex-col gap-1.5 z-20">
              {floatingReactions.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 border border-white/10 text-xs text-white animate-bounce"
                >
                  <span>{r.emoji}</span>
                  <span className="text-[11px] text-slate-300">{r.senderName}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Student Speaker Feeds (if any student was granted cam) */}
          {studentCameraTracks.length > 0 && (
            <div className="flex items-center gap-3 px-4 py-2.5 bg-[#090f1f] border-t border-white/10 overflow-x-auto">
              {studentCameraTracks.map((t) => (
                <div
                  key={t.participant.identity}
                  className="relative w-36 h-24 rounded-xl overflow-hidden border border-emerald-400/40 bg-black shrink-0"
                >
                  <video
                    ref={(el) => {
                      if (el && t.publication?.track) t.publication.track.attach(el);
                    }}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 left-1.5 text-[10px] font-semibold bg-black/70 text-white px-1.5 py-0.5 rounded">
                    {t.participant.name || "Student"}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* CONTROLS BAR */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3.5 bg-[#0f172a] border-t border-white/10">
            <div className="flex items-center gap-1.5">
              {REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReactionClick(emoji)}
                  className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 text-sm transition hover:scale-110 cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={toggleMic}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  micOn
                    ? "bg-white/[0.06] border-white/10 hover:bg-white/[0.12] text-white"
                    : "bg-rose-600 border-rose-500 hover:bg-rose-500 text-white"
                }`}
              >
                {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                {micOn ? "Mute" : "Unmute"}
              </button>

              <button
                onClick={toggleCam}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  camOn
                    ? "bg-white/[0.06] border-white/10 hover:bg-white/[0.12] text-white"
                    : "bg-rose-600 border-rose-500 hover:bg-rose-500 text-white"
                }`}
              >
                {camOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                {camOn ? "Stop Cam" : "Start Cam"}
              </button>

              <button
                onClick={toggleScreen}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  sharing
                    ? "bg-indigo-600 border-indigo-400 hover:bg-indigo-500 text-white"
                    : "bg-white/[0.06] border-white/10 hover:bg-white/[0.12] text-white"
                }`}
              >
                {sharing ? (
                  <MonitorOff className="w-4 h-4" />
                ) : (
                  <MonitorUp className="w-4 h-4" />
                )}
                {sharing ? "Stop Share" : "Share Screen"}
              </button>

              <button
                onClick={onRequestEnd}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/25 transition cursor-pointer"
              >
                <PhoneOff className="w-4 h-4" />
                End Class
              </button>
            </div>
          </div>
        </div>

        {/* CLASSROOM PANEL (CHAT + PEOPLE + PERMISSIONS + REPORTS) */}
        <LiveChatPanel
          isOpen={chatOpen}
          onClose={() => setChatOpen(false)}
          isTeacher={true}
          classId={classId}
          raisedHands={raisedHands}
          onDismissHand={(id) =>
            setRaisedHands((prev) => {
              const next = { ...prev };
              delete next[id];
              return next;
            })
          }
          chatLocked={chatLocked}
          onToggleChatLock={handleToggleChatLock}
          reports={reports}
          onAddReport={(rep) => setReports((prev) => [rep, ...prev])}
        />
      </div>
    </div>
  );
};

const TeacherLive = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [host, setHost] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle"); // "idle" | "live" | "ended"
  const [confirmEndOpen, setConfirmEndOpen] = useState(false);
  const [ending, setEnding] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [finalDuration, setFinalDuration] = useState(0);

  useEffect(() => {
    if (status !== "live") return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [status]);

  const startClass = async () => {
    setLoading(true);
    try {
      const data = await StartLiveClass(classId);
      setToken(data.token);
      setHost(data.host);
      setElapsedSeconds(0);
      setStatus("live");
      toast.success("You are live! Students can now join.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to start class");
    } finally {
      setLoading(false);
    }
  };

  const confirmAndEndClass = async () => {
    setEnding(true);
    try {
      await EndLiveClass(classId);
      setFinalDuration(elapsedSeconds);
      setToken("");
      setConfirmEndOpen(false);
      setStatus("ended");
      toast.success("Live class ended cleanly");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to end class");
    } finally {
      setEnding(false);
    }
  };

  if (status === "ended") {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4">
        <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-8 sm:p-10 flex flex-col items-center gap-5 w-full max-w-md text-center shadow-2xl">
          <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-white text-2xl font-bold tracking-tight">
              Live Class Ended
            </h1>
            <p className="text-slate-400 text-sm mt-2">
              Your live broadcast has ended and all student participants have been disconnected.
            </p>
          </div>

          <div className="w-full rounded-xl bg-[#0b1220] border border-white/[0.08] p-4 flex items-center justify-between text-sm">
            <span className="text-slate-400 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Session Duration
            </span>
            <span className="font-mono font-bold text-white">
              {formatDuration(finalDuration)}
            </span>
          </div>

          <div className="w-full flex flex-col sm:flex-row gap-3 mt-1">
            <button
              onClick={() => navigate("/dashboard/my-courses")}
              className="flex-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold py-2.5 px-5 rounded-xl text-sm transition cursor-pointer"
            >
              Back to My Courses
            </button>
            <button
              onClick={() => navigate("/dashboard/instructor")}
              className="flex-1 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white font-semibold py-2.5 px-5 rounded-xl text-sm transition cursor-pointer"
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === "idle") {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4">
        <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-8 sm:p-10 flex flex-col items-center gap-6 w-full max-w-md shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Radio className="w-7 h-7" />
          </div>
          <div className="text-center">
            <h1 className="text-white text-2xl font-bold tracking-tight">
              Ready to Go Live?
            </h1>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              Students join muted by default. You can unmute specific speakers, lock/moderate chat, view raised hands, and export session reports.
            </p>
          </div>
          <button
            onClick={startClass}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-rose-600/25 transition cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Starting Broadcast...
              </>
            ) : (
              <>
                <Radio className="w-4 h-4" /> Start Live Class
              </>
            )}
          </button>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#020617] flex flex-col overflow-hidden relative">
      <LiveKitRoom
        token={token}
        serverUrl={host}
        connect={true}
        video={true}
        audio={true}
        className="flex-1 flex flex-col min-h-0"
        onDisconnected={() => {
          if (status === "live") {
            setFinalDuration(elapsedSeconds);
            setStatus("ended");
          }
        }}
      >
        <RoomAudioRenderer />
        <TeacherRoom
          classId={classId}
          onRequestEnd={() => setConfirmEndOpen(true)}
          elapsedSeconds={elapsedSeconds}
        />
      </LiveKitRoom>

      {/* END CLASS CONFIRMATION MODAL */}
      {confirmEndOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#0f172a] border border-white/10 p-6 shadow-2xl">
            <div className="w-11 h-11 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
              <PhoneOff className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">End Live Class?</h2>
            <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">
              This will immediately end the session and disconnect all students currently watching.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setConfirmEndOpen(false)}
                disabled={ending}
                className="flex-1 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-sm font-semibold text-slate-200 transition cursor-pointer"
              >
                Keep Teaching
              </button>
              <button
                onClick={confirmAndEndClass}
                disabled={ending}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-60 text-sm font-bold text-white transition cursor-pointer"
              >
                {ending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Ending...
                  </>
                ) : (
                  "End for All"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherLive;
