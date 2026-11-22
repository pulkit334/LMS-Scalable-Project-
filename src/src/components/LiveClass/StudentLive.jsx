import { useLocation, useNavigate } from "react-router-dom";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useTracks,
  useParticipants,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { useState } from "react";
import {
  MessageSquare,
  Users,
  ArrowLeft,
  Radio,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import LiveChatPanel from "./LiveChatPanel";

const TeacherFeed = ({ onLeave, leaving }) => {
  const tracks = useTracks([Track.Source.Camera, Track.Source.ScreenShare]);
  const participants = useParticipants();
  const [chatOpen, setChatOpen] = useState(true);

  const teacherCamera = tracks.find(
    (t) => !t.participant.isLocal && t.source === Track.Source.Camera
  );
  const teacherScreen = tracks.find(
    (t) => !t.participant.isLocal && t.source === Track.Source.ScreenShare
  );

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#020617]">
      {/* TOP BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 bg-[#0f172a] border-b border-white/10">
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
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setChatOpen((prev) => !prev)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
              chatOpen
                ? "bg-amber-400/15 border-amber-400/40 text-amber-300"
                : "bg-white/[0.05] border-white/10 text-slate-300 hover:text-white"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            {chatOpen ? "Hide Chat" : "Class Chat"}
          </button>

          <button
            onClick={onLeave}
            disabled={leaving}
            className="flex items-center gap-1.5 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 disabled:opacity-50 text-white text-xs font-semibold px-4 py-1.5 rounded-xl transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {leaving ? "Leaving..." : "Leave Class"}
          </button>
        </div>
      </div>

      {/* MAIN STAGE + CHAT */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        <div className="flex-1 relative bg-black flex items-center justify-center min-h-[320px]">
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
          ) : teacherCamera ? (
            <video
              ref={(el) => {
                if (el && teacherCamera.publication?.track)
                  teacherCamera.publication.track.attach(el);
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
          {teacherScreen && teacherCamera && (
            <div className="absolute bottom-4 right-4 w-44 h-32 rounded-xl overflow-hidden border border-white/20 shadow-2xl bg-black">
              <video
                ref={(el) => {
                  if (el && teacherCamera.publication?.track)
                    teacherCamera.publication.track.attach(el);
                }}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* REAL-TIME LIVE CHAT */}
        <LiveChatPanel
          isOpen={chatOpen}
          onClose={() => setChatOpen(false)}
          title="Live Class Chat"
        />
      </div>
    </div>
  );
};

const StudentLive = () => {
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
              The instructor has ended this live session.
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
