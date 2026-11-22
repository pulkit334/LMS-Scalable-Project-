import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useTracks,
  useParticipants,
  useLocalParticipant,
  useDataChannel,
  useRoomContext,
} from "@livekit/components-react";
import { ParticipantEvent, RoomEvent, Track } from "livekit-client";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  MessageSquare,
  Users,
  ArrowLeft,
  Radio,
  AlertTriangle,
  CheckCircle2,
  Hand,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Maximize,
  Minimize,
} from "lucide-react";
import LiveChatPanel from "./LiveChatPanel";

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const REACTIONS = ["👍", "👏", "❤️", "🔥", "🎉"];

const TeacherFeed = ({ classId, onLeave, leaving }) => {
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();
  const tracks = useTracks([Track.Source.Camera, Track.Source.ScreenShare]);
  const participants = useParticipants();

  const stageRef = useRef(null);
  const [chatOpen, setChatOpen] = useState(true);
  const [handRaised, setHandRaised] = useState(false);
  const [raisedHands, setRaisedHands] = useState({});
  const [canSpeak, setCanSpeak] = useState(false);
  const [canCam, setCanCam] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [camOn, setCamOn] = useState(false);
  const [chatLocked, setChatLocked] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [floatingReactions, setFloatingReactions] = useState([]);

  const spawnReaction = (emoji, senderName) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setFloatingReactions((prev) => [...prev.slice(-12), { id, emoji, senderName }]);
    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== id));
    }, 2400);
  };

  // Sync room metadata (chatLocked) on join & live updates
  useEffect(() => {
    const syncMetadata = (raw) => {
      if (!raw) return;
      try {
        const meta = JSON.parse(raw);
        if (typeof meta.chatLocked === "boolean") setChatLocked(meta.chatLocked);
      } catch (_) {}
    };
    syncMetadata(room?.metadata);
    room?.on(RoomEvent.RoomMetadataChanged, syncMetadata);
    return () => room?.off(RoomEvent.RoomMetadataChanged, syncMetadata);
  }, [room]);

  // Listen dynamically to instructor permission updates (allowSpeak / mute / revoke)
  useEffect(() => {
    if (!localParticipant) return;

    const applyPermissions = async (perms) => {
      const p = perms || localParticipant.permissions;
      const sources = p?.canPublishSources || [];
      const allowPub = Boolean(p?.canPublish);
      const allowMic = allowPub && (sources.length === 0 || sources.includes(2));
      const allowVideo = allowPub && (sources.length === 0 || sources.includes(1));

      setCanSpeak((prev) => {
        if (!prev && allowMic) {
          toast.success("Instructor invited you to speak! Mic control unlocked.");
        } else if (prev && !allowMic) {
          toast("Your microphone was muted by the instructor", { icon: "🔇" });
        }
        return allowMic;
      });
      setCanCam(allowVideo);

      if (!allowMic && localParticipant.isMicrophoneEnabled) {
        await localParticipant.setMicrophoneEnabled(false).catch(() => {});
        setMicOn(false);
      }
      if (!allowVideo && localParticipant.isCameraEnabled) {
        await localParticipant.setCameraEnabled(false).catch(() => {});
        setCamOn(false);
      }
    };

    applyPermissions(localParticipant.permissions);
    localParticipant.on(ParticipantEvent.ParticipantPermissionsChanged, applyPermissions);
    return () => {
      localParticipant.off(
        ParticipantEvent.ParticipantPermissionsChanged,
        applyPermissions
      );
    };
  }, [localParticipant]);

  useDataChannel("classroom-events", (msg) => {
    try {
      const data = JSON.parse(decoder.decode(msg.payload));
      if (data.type === "hand_raise") {
        setRaisedHands((prev) => {
          const next = { ...prev };
          if (data.raised) next[data.identity] = data.name || "Student";
          else delete next[data.identity];
          return next;
        });
      } else if (data.type === "chat_lock") {
        setChatLocked(Boolean(data.locked));
        toast(data.locked ? "Chat locked by instructor" : "Chat unlocked by instructor", {
          icon: data.locked ? "🔒" : "🔓",
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

  const toggleHandRaise = async () => {
    const next = !handRaised;
    setHandRaised(next);
    setRaisedHands((prev) => {
      const copy = { ...prev };
      if (next) copy[localParticipant?.identity] = localParticipant?.name || "You";
      else delete copy[localParticipant?.identity];
      return copy;
    });
    try {
      await publishEvent({
        type: "hand_raise",
        raised: next,
        identity: localParticipant?.identity,
        name: localParticipant?.name || "Student",
      });
      toast(next ? "Hand raised — instructor notified" : "Hand lowered", {
        icon: "✋",
      });
    } catch (_) {}
  };

  const toggleMic = async () => {
    if (!canSpeak) return;
    await localParticipant.setMicrophoneEnabled(!micOn);
    setMicOn((prev) => !prev);
  };

  const toggleCam = async () => {
    if (!canCam) return;
    await localParticipant.setCameraEnabled(!camOn);
    setCamOn((prev) => !prev);
  };

  const handleReaction = async (emoji) => {
    spawnReaction(emoji, "You");
    try {
      await publishEvent({
        type: "reaction",
        emoji,
        name: localParticipant?.name || "Student",
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

  const teacherScreen = tracks.find(
    (t) =>
      !t.participant.isLocal &&
      t.source === Track.Source.ScreenShare
  );
  const hostCamera = tracks.find(
    (t) =>
      !t.participant.isLocal &&
      t.source === Track.Source.Camera &&
      (t.participant.name || "").includes("(Host)")
  ) || tracks.find((t) => !t.participant.isLocal && t.source === Track.Source.Camera);

  const activeSpeakerCams = tracks.filter(
    (t) =>
      t.source === Track.Source.Camera &&
      t !== hostCamera
  );

  return (
    <div ref={stageRef} className="flex-1 flex flex-col min-h-0 bg-[#020617]">
      {/* TOP BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 bg-[#0f172a] border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-rose-500/15 border border-rose-500/30 px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-rose-400 text-xs font-bold uppercase tracking-wider">
              Live Class
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-white/[0.05] border border-white/10 px-3 py-1 rounded-full">
            <Users className="w-3.5 h-3.5 text-sky-400" />
            <span>{participants.length} in room</span>
          </div>
          {canSpeak && (
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300">
              Speaker Mode Active
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
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
            {chatOpen ? "Hide Chat" : "Classroom"}
          </button>

          <button
            onClick={onLeave}
            disabled={leaving}
            className="flex items-center gap-1.5 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 disabled:opacity-50 text-white text-xs font-semibold px-4 py-1.5 rounded-xl transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {leaving ? "Leaving..." : "Leave"}
          </button>
        </div>
      </div>

      {/* MAIN STAGE + CHAT */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          <div className="flex-1 relative bg-black flex items-center justify-center min-h-[280px]">
            {teacherScreen ? (
              <video
                ref={(el) => {
                  if (el && teacherScreen.publication?.track)
                    teacherScreen.publication.track.attach(el);
                }}
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
            ) : hostCamera ? (
              <video
                ref={(el) => {
                  if (el && hostCamera.publication?.track)
                    hostCamera.publication.track.attach(el);
                }}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-slate-400">
                <Radio className="w-9 h-9 text-amber-400 animate-pulse" />
                <p className="text-sm font-medium">Waiting for instructor stream...</p>
              </div>
            )}

            {/* PIP camera when screen sharing */}
            {teacherScreen && hostCamera && (
              <div className="absolute bottom-4 right-4 w-44 h-32 rounded-xl overflow-hidden border border-white/20 shadow-2xl bg-black">
                <video
                  ref={(el) => {
                    if (el && hostCamera.publication?.track)
                      hostCamera.publication.track.attach(el);
                  }}
                  autoPlay
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

          {/* Active Student Speakers Strip */}
          {activeSpeakerCams.length > 0 && (
            <div className="flex items-center gap-3 px-4 py-2.5 bg-[#090f1f] border-t border-white/10 overflow-x-auto">
              {activeSpeakerCams.map((t) => (
                <div
                  key={t.participant.identity}
                  className="relative w-36 h-24 rounded-xl overflow-hidden border border-white/20 bg-black shrink-0"
                >
                  <video
                    ref={(el) => {
                      if (el && t.publication?.track) t.publication.track.attach(el);
                    }}
                    autoPlay
                    muted={t.participant.isLocal}
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 left-1.5 text-[10px] font-semibold bg-black/70 text-white px-1.5 py-0.5 rounded">
                    {t.participant.isLocal ? "You" : t.participant.name || "Speaker"}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* STUDENT CONTROLS BAR (Raise Hand + Reactions + Dynamic Mic/Cam when allowed) */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 bg-[#0f172a] border-t border-white/10">
            <div className="flex items-center gap-1.5">
              {REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 text-sm transition hover:scale-110 cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {canSpeak && (
                <button
                  onClick={toggleMic}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                    micOn
                      ? "bg-emerald-600 border-emerald-400 text-white"
                      : "bg-white/[0.06] border-white/10 text-slate-200 hover:text-white"
                  }`}
                >
                  {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  {micOn ? "Mic On" : "Unmute Mic"}
                </button>
              )}

              {canCam && (
                <button
                  onClick={toggleCam}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                    camOn
                      ? "bg-emerald-600 border-emerald-400 text-white"
                      : "bg-white/[0.06] border-white/10 text-slate-200 hover:text-white"
                  }`}
                >
                  {camOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                  {camOn ? "Cam On" : "Start Cam"}
                </button>
              )}

              <button
                onClick={toggleHandRaise}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  handRaised
                    ? "bg-amber-400 border-amber-300 text-slate-950 font-bold"
                    : "bg-white/[0.06] border-white/10 text-slate-200 hover:border-amber-400/50 hover:text-amber-300"
                }`}
              >
                <Hand className="w-4 h-4" />
                {handRaised ? "Lower Hand" : "Raise Hand"}
              </button>
            </div>
          </div>
        </div>

        {/* REAL-TIME LIVE CHAT + PEOPLE + PRIVATE DM */}
        <LiveChatPanel
          isOpen={chatOpen}
          onClose={() => setChatOpen(false)}
          isTeacher={false}
          classId={classId}
          raisedHands={raisedHands}
          chatLocked={chatLocked}
        />
      </div>
    </div>
  );
};

const StudentLive = () => {
  const { classId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [leaving, setLeaving] = useState(false);
  const [ended, setEnded] = useState(false);
  const { token, host } = state || {};

  if (ended) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4">
        <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-8 sm:p-10 flex flex-col items-center gap-5 max-w-sm w-full text-center shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-white text-xl font-bold">Live Class Ended</h2>
            <p className="text-slate-400 text-sm mt-1.5">
              The live session has ended.
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard/enrolled-courses")}
            className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer"
          >
            Back to Enrolled Courses
          </button>
        </div>
      </div>
    );
  }

  if (!token || !host) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4">
        <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-8 sm:p-10 flex flex-col items-center gap-5 max-w-sm w-full text-center shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-white text-xl font-bold">Session Expired</h2>
            <p className="text-slate-400 text-sm mt-1.5">
              Your session link is invalid or the class has already ended.
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard/enrolled-courses")}
            className="w-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 text-white py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer"
          >
            ← Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#020617] flex flex-col overflow-hidden">
      <LiveKitRoom
        token={token}
        serverUrl={host}
        connect={true}
        video={false}
        audio={false}
        className="flex-1 flex flex-col min-h-0"
        onDisconnected={() => {
          if (!leaving) setEnded(true);
        }}
      >
        <RoomAudioRenderer />
        <TeacherFeed
          classId={classId}
          leaving={leaving}
          onLeave={() => {
            setLeaving(true);
            navigate("/dashboard/enrolled-courses");
          }}
        />
      </LiveKitRoom>
    </div>
  );
};

export default StudentLive;
