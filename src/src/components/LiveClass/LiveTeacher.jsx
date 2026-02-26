/* eslint-disable no-unused-vars */
import { useState } from "react";
import {
  LiveKitRoom, RoomAudioRenderer, useTracks,
  useLocalParticipant
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { useParams, useNavigate } from "react-router-dom";
import { StartLiveClass, EndLiveClass } from "../../services/Live/Live-Services";

const TeacherRoom = ({ onEnd }) => {
  const { localParticipant } = useLocalParticipant()
  const tracks = useTracks([Track.Source.Camera, Track.Source.ScreenShare])
  const cameraTrack = tracks.find(t => t.participant.isLocal && t.source === Track.Source.Camera)
  const screenTrack = tracks.find(t => t.participant.isLocal && t.source === Track.Source.ScreenShare)

  const [micOn, setMicOn] = useState(true)
  const [camOn, setCamOn] = useState(true)
  const [sharing, setSharing] = useState(false)

  const toggleMic = async () => {
    await localParticipant.setMicrophoneEnabled(!micOn)
    setMicOn(prev => !prev)
  }

  const toggleCam = async () => {
    await localParticipant.setCameraEnabled(!camOn)
    setCamOn(prev => !prev)
  }

  const toggleScreen = async () => {
    await localParticipant.setScreenShareEnabled(!sharing)
    setSharing(prev => !prev)
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-950">

      {/* MAIN VIEW */}
      <div className="flex-1 relative bg-black">
        {/* screen share takes priority */}
        {screenTrack ? (
          <video
            ref={el => { if (el && screenTrack.publication?.track) screenTrack.publication.track.attach(el) }}
            autoPlay muted playsInline
            className="w-full h-full object-contain"
          />
        ) : cameraTrack ? (
          <video
            ref={el => { if (el && cameraTrack.publication?.track) cameraTrack.publication.track.attach(el) }}
             style={{ transform: ' scaleX(-1)' }}
            autoPlay muted playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            Camera is off
          </div>
        )}

        {/* PIP camera when screen sharing */}
        {screenTrack && cameraTrack && (
          <div className="absolute bottom-4 right-4 w-48 h-36 rounded-xl overflow-hidden border-2 border-gray-700 shadow-xl">
            <video
              ref={el => { if (el && cameraTrack.publication?.track) cameraTrack.publication.track.attach(el) }}
              autoPlay muted playsInline
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* CONTROLS */}
      <div className="flex items-center justify-center gap-4 px-6 py-4 bg-gray-900 border-t border-gray-800">

        {/* Mic */}
        <button onClick={toggleMic}
          className={`flex flex-col items-center gap-1 px-5 py-3 rounded-xl transition text-xs font-semibold
            ${micOn ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}>
          <span className="text-xl">{micOn ? '🎙️' : '🔇'}</span>
          {micOn ? 'Mute' : 'Unmute'}
        </button>

        {/* Camera */}
        <button onClick={toggleCam}
          className={`flex flex-col items-center gap-1 px-5 py-3 rounded-xl transition text-xs font-semibold
            ${camOn ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}>
          <span className="text-xl">{camOn ? '📷' : '📷'}</span>
          {camOn ? 'Stop Cam' : 'Start Cam'}
        </button>

        {/* Screen Share */}
        <button onClick={toggleScreen}
          className={`flex flex-col items-center gap-1 px-5 py-3 rounded-xl transition text-xs font-semibold
            ${sharing ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}>
          <span className="text-xl">🖥️</span>
          {sharing ? 'Stop Share' : 'Share Screen'}
        </button>

        {/* End Class */}
        <button onClick={onEnd}
          className="flex flex-col items-center gap-1 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition">
          <span className="text-xl">⏹️</span>
          End Class
        </button>
      </div>
    </div>
  )
}

const TeacherLive = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [host, setHost] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);

  const startClass = async () => {
    setLoading(true);
    try {
      const data = await StartLiveClass(classId);
      setToken(data.token);
      setHost(data.host);
      setIsLive(true);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to start class");
    } finally {
      setLoading(false);
    }
  };

  const endClass = async () => {
    try {
      await EndLiveClass(classId);
      setToken("");
      setIsLive(false);
      navigate(-1);
    } catch (err) {
      alert("Failed to end class");
    }
  };

  if (!isLive) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 flex flex-col items-center gap-6 w-full max-w-md">
          <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
          <h1 className="text-white text-2xl font-bold">Ready to Go Live?</h1>
          <p className="text-gray-400 text-sm text-center">
            Make sure your camera and mic are ready. Students will be notified when you go live.
          </p>
          <button onClick={startClass} disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl transition">
            {loading ? "Starting..." : "🔴 Go Live"}
          </button>
          <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-300 text-sm transition">
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* TOP BAR */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
          <span className="text-white font-semibold">You are Live</span>
        </div>
      </div>

      <LiveKitRoom
        token={token}
        serverUrl={host}
        connect={true}
        video={true}
        audio={true}
        className="flex-1 flex flex-col"
        onDisconnected={() => navigate(-1)}
      >
        <RoomAudioRenderer />
        <TeacherRoom onEnd={endClass} />
      </LiveKitRoom>
    </div>
  );
};

export default TeacherLive;