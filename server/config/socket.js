import { Server } from 'socket.io'

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: true, 
      credentials: true,
      methods: ["GET", "POST"]
    }
  })

  io.on('connection', (socket) => {
    socket.on('join:course', (courseId) => {
      socket.join(`course:${courseId}`)
    })
    socket.on('disconnect', () => {})
  })
}

export const getIO = () => io