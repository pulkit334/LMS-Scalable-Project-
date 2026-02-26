import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

export const useLiveStatus = (courseIds = []) => {
  const [liveMap, setLiveMap] = useState({})

  useEffect(() => {
    if (!courseIds.length) return

    const socket = io(import.meta.env.VITE_SOCKET_URL, {
      withCredentials: true
    })

    // wait for connection before joining rooms
    socket.on('connect', () => {
      courseIds.forEach(id => socket.emit('join:course', id))
    })

   
    socket.on('class:live', (data) => {
      setLiveMap(prev => ({
        ...prev,
        [data.course]: data   // { classId, title, course }
      }))
    })

    return () => socket.disconnect()
  }, [courseIds.length])

  return liveMap
}
// Component mounts with courseId
//           ↓
// useEffect runs
//           ↓
// Socket connects to your backend server
// (http://localhost:5000)
//           ↓
// Emits "join:course" event with courseId
//           ↓
// Backend puts this socket in room "course:courseId"
// (like joining a WhatsApp group)
//           ↓
// Socket just sits and listens...
//           ↓
// Teacher clicks Go Live
//           ↓
// Backend emits "class:live" to "course:courseId" room
//           ↓
// This socket receives "class:live" event
//           ↓
// setLiveData({ classId, title, courseId })
//           ↓
// Component re-renders
//           ↓
// "Join Live" button appears instantly
//           ↓
// Student clicks join → navigates to watch page
//           ↓
// Component unmounts → socket.disconnect()