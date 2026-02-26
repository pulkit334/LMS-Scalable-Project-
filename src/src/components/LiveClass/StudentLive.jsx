import { useLocation, useNavigate } from 'react-router-dom'
import { LiveKitRoom, RoomAudioRenderer, useTracks } from '@livekit/components-react'
import { Track } from 'livekit-client'
import { useState } from 'react'

const TeacherFeed = () => {
  const tracks = useTracks([Track.Source.Camera, Track.Source.ScreenShare])
  const teacherCamera = tracks.find(t => !t.participant.isLocal && t.source === Track.Source.Camera)
  const teacherScreen = tracks.find(t => !t.participant.isLocal && t.source === Track.Source.ScreenShare)

  return (
    <div className="flex-1 relative bg-black flex items-center justify-center">

      {/* screen share is main view */}
      {teacherScreen ? (
        <video
          ref={el => { if (el && teacherScreen.publication?.track) teacherScreen.publication.track.attach(el) }}
          autoPlay playsInline
          className="w-full h-full object-contain"
        />
      ) : teacherCamera ? (
        <video
          ref={el => { if (el && teacherCamera.publication?.track) teacherCamera.publication.track.attach(el) }}
          autoPlay playsInline
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <span className="text-4xl">📡</span>
          <p className="text-sm">Waiting for teacher...</p>
        </div>
      )}

      {/* PIP camera when screen sharing */}
      {teacherScreen && teacherCamera && (
        <div className="absolute bottom-4 right-4 w-48 h-36 rounded-xl overflow-hidden border-2 border-gray-700 shadow-xl">
          <video
            ref={el => { if (el && teacherCamera.publication?.track) teacherCamera.publication.track.attach(el) }}
            autoPlay playsInline
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  )
}

const StudentLive = () => {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [leaving, setLeaving] = useState(false)
  const { token, host } = state || {}

  if (!token || !host) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 flex flex-col items-center gap-5 max-w-sm w-full text-center">
          <span className="text-3xl">⚠️</span>
          <h2 className="text-white text-xl font-bold">Session Expired</h2>
          <p className="text-gray-500 text-sm">Your session is invalid or the class has ended.</p>
          <button onClick={() => navigate(-1)}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl text-sm font-semibold transition">
            ← Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          <span className="text-red-400 text-xs font-bold uppercase tracking-widest">Live</span>
        </div>
        <button
          onClick={() => { setLeaving(true); navigate(-1) }}
          disabled={leaving}
          className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2 rounded-xl transition">
          {leaving ? 'Leaving...' : '← Leave Class'}
        </button>
      </div>

      <LiveKitRoom
        token={token}
        serverUrl={host}
        connect={true}
        video={false}
        audio={false}
        className="flex-1 flex flex-col"
        onDisconnected={() => navigate(-1)}
      >
        <RoomAudioRenderer />
        <TeacherFeed />
      </LiveKitRoom>
    </div>
  )
}

export default StudentLive