import { useEffect, useMemo, useRef, useState } from "react";
import {
  useDataChannel,
  useLocalParticipant,
  useParticipants,
} from "@livekit/components-react";
import toast from "react-hot-toast";
import {
  Send,
  MessageSquare,
  Users,
  Flag,
  Trash2,
  Mic,
  MicOff,
  Video,
  VideoOff,
  UserX,
  Lock,
  Unlock,
  Hand,
  Download,
  MessageCircleOff,
  X,
  ShieldAlert,
} from "lucide-react";
import {
  KickStudentAPI,
  UpdateStudentPermissionsAPI,
} from "../../services/Live/Live-Services";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const LiveChatPanel = ({
  isOpen,
  onClose,
  isTeacher = false,
  classId = "",
  raisedHands = {},
  onDismissHand,
  chatLocked = false,
  onToggleChatLock,
  onReaction,
  reports = [],
  onAddReport,
}) => {
  const { localParticipant } = useLocalParticipant();
  const participants = useParticipants();

  const [activeTab, setActiveTab] = useState("chat"); // "chat" | "people" | "reports"
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [dmTargetIdentity, setDmTargetIdentity] = useState("ALL"); // "ALL" | participant.identity
  const [mutedChatIds, setMutedChatIds] = useState({});
  const [busyIdentity, setBusyIdentity] = useState(null);
  const endRef = useRef(null);
  const knownIdsRef = useRef(new Set());
  const initializedRef = useRef(false);

  // Live join / leave alerts for who is currently joining
  useEffect(() => {
    const currentIds = new Set(participants.map((p) => p.identity));
    if (!initializedRef.current) {
      knownIdsRef.current = currentIds;
      initializedRef.current = true;
      return;
    }

    participants.forEach((p) => {
      if (!knownIdsRef.current.has(p.identity) && p.identity !== localParticipant?.identity) {
        const label = p.name || p.identity;
        toast(`${label} joined the class`, { icon: "👋", duration: 2500 });
      }
    });

    knownIdsRef.current = currentIds;
  }, [participants, localParticipant?.identity]);

  // Listen to classroom-chat LiveKit DataChannel
  useDataChannel("classroom-chat", (msg) => {
    try {
      const data = JSON.parse(decoder.decode(msg.payload));
      if (data.type === "chat") {
        setMessages((prev) => {
          if (prev.some((m) => m.id === data.id)) return prev;
          return [...prev, data];
        });
      } else if (data.type === "delete_message") {
        setMessages((prev) => prev.filter((m) => m.id !== data.msgId));
      } else if (data.type === "report_message" && isTeacher) {
        onAddReport?.(data.report);
        toast(`Message reported by ${data.report?.reportedBy}`, {
          icon: "🚩",
          duration: 3500,
        });
      }
    } catch (_) {}
  });

  useEffect(() => {
    if (activeTab === "chat") {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, activeTab]);

  const localIdentity = localParticipant?.identity || "";
  const localName =
    localParticipant?.name || (isTeacher ? "Instructor (Host)" : "Student");

  const otherParticipants = useMemo(
    () => participants.filter((p) => p.identity !== localIdentity),
    [participants, localIdentity]
  );

  const selectedDmUser = useMemo(
    () => otherParticipants.find((p) => p.identity === dmTargetIdentity),
    [otherParticipants, dmTargetIdentity]
  );

  const canSendChat =
    isTeacher ||
    (!chatLocked && localParticipant?.permissions?.canPublishData !== false);

  const publishChatPayload = async (payload, destinationIdentities) => {
    if (!localParticipant) return;
    const opts = { reliable: true, topic: "classroom-chat" };
    if (destinationIdentities && destinationIdentities.length > 0) {
      opts.destinationIdentities = destinationIdentities;
    }
    await localParticipant.publishData(encoder.encode(JSON.stringify(payload)), opts);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || !canSendChat) return;

    const isPrivate = dmTargetIdentity !== "ALL" && Boolean(selectedDmUser);
    const msgObj = {
      type: "chat",
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      senderIdentity: localIdentity,
      senderName: localName,
      isHost: isTeacher,
      isPrivate,
      targetIdentity: isPrivate ? selectedDmUser.identity : null,
      targetName: isPrivate ? selectedDmUser.name || selectedDmUser.identity : "Everyone",
      text,
      timestamp: Date.now(),
    };

    try {
      await publishChatPayload(
        msgObj,
        isPrivate ? [selectedDmUser.identity] : undefined
      );
      setMessages((prev) => [...prev, msgObj]);
      setInput("");
    } catch (err) {
      toast.error("Unable to send message");
    }
  };

  const handleDeleteMessage = async (msgId) => {
    if (!isTeacher) return;
    setMessages((prev) => prev.filter((m) => m.id !== msgId));
    try {
      await publishChatPayload({ type: "delete_message", msgId });
      toast.success("Message removed");
    } catch (_) {}
  };

  const handleReportMessage = async (m) => {
    const report = {
      id: `rep-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      msgId: m.id,
      senderIdentity: m.senderIdentity,
      senderName: m.senderName,
      text: m.text,
      reportedBy: localName,
      timestamp: Date.now(),
    };

    if (isTeacher) {
      onAddReport?.(report);
      toast.success("Added to Moderation Reports");
      return;
    }

    try {
      await publishChatPayload({ type: "report_message", report });
      toast.success("Message reported to instructor");
    } catch (_) {
      toast.error("Failed to report message");
    }
  };

  const handlePermissionChange = async (participant, changes) => {
    if (!isTeacher || !classId) return;
    const identity = participant.identity;
    setBusyIdentity(identity);
    try {
      const currentSources = participant.permissions?.canPublishSources || [];
      const hasMic =
        changes.allowSpeak !== undefined
          ? changes.allowSpeak
          : participant.permissions?.canPublish &&
            (currentSources.length === 0 || currentSources.includes(2));
      const hasCam =
        changes.allowCamera !== undefined
          ? changes.allowCamera
          : participant.permissions?.canPublish &&
            (currentSources.length === 0 || currentSources.includes(1));
      const hasChat =
        changes.allowChat !== undefined
          ? changes.allowChat
          : participant.permissions?.canPublishData !== false;

      await UpdateStudentPermissionsAPI(classId, {
        identity,
        allowSpeak: hasMic,
        allowCamera: hasCam,
        allowChat: hasChat,
      });

      if (changes.allowChat !== undefined) {
        setMutedChatIds((prev) => ({ ...prev, [identity]: !hasChat }));
      }
      if (changes.allowSpeak) {
        onDismissHand?.(identity);
      }
      toast.success(`Updated permissions for ${participant.name || identity}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update permission");
    } finally {
      setBusyIdentity(null);
    }
  };

  const handleKick = async (identity, name) => {
    if (!isTeacher || !classId) return;
    setBusyIdentity(identity);
    try {
      await KickStudentAPI(classId, identity);
      toast.success(`Removed ${name || identity} from class`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to remove participant");
    } finally {
      setBusyIdentity(null);
    }
  };

  const handleDownloadReport = () => {
    const lines = [
      `LIVE CLASS REPORT - ${new Date().toLocaleString()}`,
      `Class ID: ${classId}`,
      `Total Currently Joined: ${participants.length}`,
      "",
      "--- PARTICIPANTS ---",
      ...participants.map(
        (p) =>
          `- ${p.name || p.identity} (ID: ${p.identity}) | Mic: ${p.isMicrophoneEnabled ? "ON" : "OFF"} | Cam: ${p.isCameraEnabled ? "ON" : "OFF"} | CanPublish: ${Boolean(p.permissions?.canPublish)}`
      ),
      "",
      "--- CHAT LOG ---",
      ...messages.map(
        (m) =>
          `[${new Date(m.timestamp).toLocaleTimeString()}] ${m.senderName}${m.isPrivate ? ` -> (Private: ${m.targetName})` : ""}: ${m.text}`
      ),
      "",
      "--- REPORTED MESSAGES ---",
      ...(reports.length
        ? reports.map(
            (r) =>
              `[${new Date(r.timestamp).toLocaleTimeString()}] Sender: ${r.senderName} | Reported by: ${r.reportedBy} | Message: "${r.text}"`
          )
        : ["No reported messages."]),
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `live-class-report-${classId || "session"}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const sortedParticipants = useMemo(() => {
    return [...participants].sort((a, b) => {
      const aHost = (a.name || "").includes("(Host)") ? 1 : 0;
      const bHost = (b.name || "").includes("(Host)") ? 1 : 0;
      if (aHost !== bHost) return bHost - aHost;
      const aHand = raisedHands[a.identity] ? 1 : 0;
      const bHand = raisedHands[b.identity] ? 1 : 0;
      return bHand - aHand;
    });
  }, [participants, raisedHands]);

  const raisedCount = Object.keys(raisedHands).length;

  if (!isOpen) return null;

  return (
    <aside className="w-full md:w-84 lg:w-96 flex flex-col bg-[#0b1220] border-l border-white/10 h-full shrink-0">
      {/* Tabs Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/10 bg-[#0f172a]">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === "chat"
                ? "bg-amber-400 text-slate-950"
                : "text-slate-300 hover:bg-white/[0.06]"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Chat
          </button>

          <button
            onClick={() => setActiveTab("people")}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === "people"
                ? "bg-amber-400 text-slate-950"
                : "text-slate-300 hover:bg-white/[0.06]"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            People ({participants.length})
            {raisedCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                ✋{raisedCount}
              </span>
            )}
          </button>

          {isTeacher && (
            <button
              onClick={() => setActiveTab("reports")}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === "reports"
                  ? "bg-amber-400 text-slate-950"
                  : "text-slate-300 hover:bg-white/[0.06]"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Reports
              {reports.length > 0 && (
                <span className="px-1.5 rounded-full bg-rose-500 text-white text-[10px]">
                  {reports.length}
                </span>
              )}
            </button>
          )}
        </div>

        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close panel"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ==================== TAB 1: CHAT (PUBLIC + PRIVATE DM) ==================== */}
      {activeTab === "chat" && (
        <>
          {isTeacher && (
            <div className="flex items-center justify-between px-4 py-2 bg-[#11192e] border-b border-white/[0.07] text-xs">
              <span className="text-slate-400">
                {chatLocked ? "Student chat is locked" : "Public & Private chat active"}
              </span>
              <button
                onClick={onToggleChatLock}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold cursor-pointer transition ${
                  chatLocked
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    : "bg-white/[0.06] text-slate-300 hover:text-white"
                }`}
              >
                {chatLocked ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                {chatLocked ? "Unlock Chat" : "Lock Chat"}
              </button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-[240px]">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4 py-12">
                <MessageSquare className="w-8 h-8 text-slate-600 mb-2" />
                <p className="text-sm font-medium text-slate-300">No messages yet</p>
                <p className="text-xs text-slate-500 mt-1">
                  Send a public message to everyone or switch to Private DM below.
                </p>
              </div>
            ) : (
              messages.map((m) => {
                const isMine = m.senderIdentity === localIdentity;
                return (
                  <div
                    key={m.id}
                    className={`group flex flex-col ${isMine ? "items-end" : "items-start"}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 px-1 flex-wrap">
                      <span
                        className={`text-[11px] font-semibold ${
                          m.isHost
                            ? "text-amber-400"
                            : isMine
                              ? "text-sky-400"
                              : "text-slate-300"
                        }`}
                      >
                        {isMine ? "You" : m.senderName}
                      </span>
                      {m.isPrivate && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-violet-500/20 text-violet-300 border border-violet-400/30">
                          {isMine ? `Private → ${m.targetName}` : "Private DM"}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-500">
                        {new Date(m.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className="flex items-end gap-1.5 max-w-[90%]">
                      <div
                        className={`rounded-2xl px-3.5 py-2 text-xs sm:text-[13px] leading-relaxed break-words ${
                          m.isPrivate
                            ? "bg-violet-600/25 border border-violet-400/40 text-violet-100"
                            : isMine
                              ? "bg-amber-400 text-slate-950 font-medium rounded-br-sm"
                              : m.isHost
                                ? "bg-indigo-500/20 border border-indigo-400/30 text-slate-100 rounded-bl-sm"
                                : "bg-[#161f33] border border-white/[0.08] text-slate-200 rounded-bl-sm"
                        }`}
                      >
                        {m.text}
                      </div>

                      {/* Quick hover moderation / report actions */}
                      {!isMine && (
                        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                          <button
                            onClick={() => handleReportMessage(m)}
                            title="Report message"
                            className="p-1 rounded bg-white/[0.06] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 cursor-pointer"
                          >
                            <Flag className="w-3 h-3" />
                          </button>
                          {isTeacher && (
                            <button
                              onClick={() => handleDeleteMessage(m.id)}
                              title="Delete message"
                              className="p-1 rounded bg-white/[0.06] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={endRef} />
          </div>

          {/* Recipient selector + Input */}
          <div className="p-3 border-t border-white/10 bg-[#0f172a] space-y-2">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="text-slate-400 shrink-0">To:</span>
              <select
                value={dmTargetIdentity}
                onChange={(e) => setDmTargetIdentity(e.target.value)}
                className="flex-1 bg-[#0b1220] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-slate-200 outline-none focus:border-amber-400/70"
              >
                <option value="ALL">Everyone (Public Chat)</option>
                {otherParticipants.map((p) => (
                  <option key={p.identity} value={p.identity}>
                    🔒 Private DM: {p.name || p.identity}
                  </option>
                ))}
              </select>
            </div>

            {canSendChat ? (
              <form onSubmit={handleSend} className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    dmTargetIdentity === "ALL"
                      ? "Message everyone..."
                      : `Private message to ${selectedDmUser?.name || "participant"}...`
                  }
                  className="flex-1 bg-[#0b1220] border border-white/10 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400/70 transition"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  aria-label="Send message"
                  className="w-9 h-9 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-slate-950 flex items-center justify-center transition cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-xs text-rose-300">
                <Lock className="w-3.5 h-3.5" />
                {chatLocked
                  ? "Chat has been locked by the instructor"
                  : "Your chat access has been muted"}
              </div>
            )}
          </div>
        </>
      )}

      {/* ==================== TAB 2: PARTICIPANTS & HAND RAISES ==================== */}
      {activeTab === "people" && (
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {sortedParticipants.map((p) => {
            const isSelf = p.identity === localIdentity;
            const isHost = (p.name || "").includes("(Host)");
            const handUp = Boolean(raisedHands[p.identity]);
            const canPublish = Boolean(p.permissions?.canPublish);
            const chatMuted = mutedChatIds[p.identity] || p.permissions?.canPublishData === false;

            return (
              <div
                key={p.identity}
                className={`rounded-xl p-3 border transition ${
                  handUp
                    ? "bg-amber-400/10 border-amber-400/40"
                    : "bg-[#11192e] border-white/[0.07]"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-semibold text-white truncate">
                        {p.name || p.identity} {isSelf ? "(You)" : ""}
                      </span>
                      {isHost && (
                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                          Host
                        </span>
                      )}
                      {handUp && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 animate-pulse">
                          <Hand className="w-3 h-3" /> Raised Hand
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                      <span className={p.isMicrophoneEnabled ? "text-emerald-400" : ""}>
                        {p.isMicrophoneEnabled ? "Mic On" : "Mic Off"}
                      </span>
                      <span>•</span>
                      <span className={p.isCameraEnabled ? "text-emerald-400" : ""}>
                        {p.isCameraEnabled ? "Cam On" : "Cam Off"}
                      </span>
                    </div>
                  </div>

                  {!isSelf && (
                    <button
                      onClick={() => {
                        setDmTargetIdentity(p.identity);
                        setActiveTab("chat");
                      }}
                      title="Send Private DM"
                      className="px-2.5 py-1 rounded-lg bg-violet-500/20 border border-violet-400/30 text-violet-200 hover:bg-violet-500/30 text-[11px] font-semibold cursor-pointer shrink-0"
                    >
                      DM
                    </button>
                  )}
                </div>

                {/* Teacher moderation & speak-stage permission controls */}
                {isTeacher && !isSelf && !isHost && (
                  <div className="flex flex-wrap items-center gap-1.5 mt-2.5 pt-2.5 border-t border-white/[0.07]">
                    <button
                      disabled={busyIdentity === p.identity}
                      onClick={() =>
                        handlePermissionChange(p, {
                          allowSpeak: !canPublish,
                          allowCamera: !canPublish,
                        })
                      }
                      className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold cursor-pointer transition ${
                        canPublish
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-rose-500/20 hover:text-rose-300"
                          : "bg-amber-400/15 text-amber-300 border border-amber-400/30 hover:bg-amber-400 hover:text-slate-950"
                      }`}
                    >
                      {canPublish ? (
                        <>
                          <MicOff className="w-3 h-3" /> Revoke Speak
                        </>
                      ) : (
                        <>
                          <Mic className="w-3 h-3" /> Allow Speak
                        </>
                      )}
                    </button>

                    <button
                      disabled={busyIdentity === p.identity}
                      onClick={() =>
                        handlePermissionChange(p, {
                          allowSpeak: true,
                          allowCamera: !(p.permissions?.canPublish && (p.permissions?.canPublishSources || []).includes(1)),
                        })
                      }
                      title="Toggle Student Camera Permission"
                      className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold bg-white/[0.06] text-slate-300 hover:text-white cursor-pointer"
                    >
                      <Video className="w-3 h-3" /> Cam
                    </button>

                    <button
                      disabled={busyIdentity === p.identity}
                      onClick={() =>
                        handlePermissionChange(p, { allowChat: chatMuted })
                      }
                      title={chatMuted ? "Unmute chat" : "Mute chat"}
                      className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold cursor-pointer ${
                        chatMuted
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          : "bg-white/[0.06] text-slate-300 hover:text-white"
                      }`}
                    >
                      <MessageCircleOff className="w-3 h-3" />
                      {chatMuted ? "Unmute Chat" : "Mute Chat"}
                    </button>

                    <button
                      disabled={busyIdentity === p.identity}
                      onClick={() => handleKick(p.identity, p.name)}
                      title="Remove from class"
                      className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold bg-rose-500/15 text-rose-300 hover:bg-rose-600 hover:text-white cursor-pointer ml-auto"
                    >
                      <UserX className="w-3 h-3" /> Kick
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ==================== TAB 3: REPORTS & SESSION LOG (TEACHER ONLY) ==================== */}
      {isTeacher && activeTab === "reports" && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-white/10 flex items-center justify-between bg-[#11192e]">
            <span className="text-xs font-semibold text-slate-300">
              Moderation Reports ({reports.length})
            </span>
            <button
              onClick={handleDownloadReport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold cursor-pointer transition"
            >
              <Download className="w-3.5 h-3.5" />
              Export Log
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {reports.length === 0 ? (
              <div className="text-center py-14 px-4">
                <ShieldAlert className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-300">No reports yet</p>
                <p className="text-xs text-slate-500 mt-1">
                  Flagged messages from students will appear here for instant review, mute, or kick.
                </p>
              </div>
            ) : (
              reports.map((r) => (
                <div
                  key={r.id}
                  className="rounded-xl p-3 bg-rose-950/25 border border-rose-500/25 space-y-2"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-rose-300">{r.senderName}</span>
                    <span className="text-slate-400">
                      Reported by {r.reportedBy}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 bg-black/30 rounded-lg p-2">
                    &ldquo;{r.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeleteMessage(r.msgId)}
                      className="px-2.5 py-1 rounded bg-white/[0.07] hover:bg-white/[0.15] text-[11px] font-semibold text-slate-200 cursor-pointer"
                    >
                      Delete Msg
                    </button>
                    <button
                      onClick={() => handleKick(r.senderIdentity, r.senderName)}
                      className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-[11px] font-semibold text-white cursor-pointer"
                    >
                      Kick User
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </aside>
  );
};

export default LiveChatPanel;
