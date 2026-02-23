import { createRoom, generateToken } from './service/livekit.service.js'


const room = await createRoom('test-room-123')
console.log(' Room created:', room.name)

const token = await generateToken('test-room-123', 'teacher-1', true)
console.log(' Token generated:', token)