/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useTracks,
  useLocalParticipant,
  useParticipants,
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
} from "lucide-react";
import { StartLiveClass, EndLiveClass } from "../../services/Live/Live-Services";
import LiveChatPanel from "./LiveChatPanel";

const formatDuration = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return hrs > 0 ? `${pad(hrs)}:${pad(mins)}:${pad(secs)}` : `${pad(mins)}:${pad(secs)}`;
};

const TeacherRoom = ({ onRequestEnd, elapsedSeconds }) => {
  const { localParticipant } = useLocalParticipant();
  const participants = useParticipants();
  const tracks = useTracks([Track.Source.Camera, Track.Source.ScreenShare]);
  const cameraTrack = tracks.find(
    (t) => t.participant.isLocal && t.source === Track.Source.Camera
  );
  const screenTrack = tracks.find(
    (t) => t.participant.isLocal && t.source === Track.Source.ScreenShare
  );

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);

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

  const studentCount = Math.max(0, participants.length - 1);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#020617]">
      {/* TOP BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 bg-[#0f172a] border-b border-white/10">
        <div className="flex items-center gap-3">
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
              {studentCount} {studentCount === 1 ? "student" : "students"} watching
            </span>
          </div>
        </div>

        <button
          onClick={() => setChatOpen((prev) => !prev)}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
            chatOpen
              ? "bg-amber-400/15 border-amber-400/40 text-amber-300"
              : "bg-white/[0.05] border-white/10 text-slate-300 hover:text-white"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          {chatOpen ? "Hide Chat" : "Open Chat"}
        </button>
      </div>

      {/* MAIN STAGE + CHAT DRAWER */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          {/* VIDEO VIEW */}
          <div className="flex-1 relative bg-black flex items-center justify-center min-h-[320px]">
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
          </div>

          {/* CONTROLS BAR */}
          <div className="flex flex-wrap items-center justify-center gap-3 px-6 py-4 bg-[#0f172a] border-t border-white/10">
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

        {/* REAL-TIME LIVE CHAT */}
        <LiveChatPanel
          isOpen={chatOpen}
          onClose={() => setChatOpen(false)}
          title="Class Q&A Chat"
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
              Check your camera and microphone before starting. Enrolled students will see the live indicator and can join with real-time chat.
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
