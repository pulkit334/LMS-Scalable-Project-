import { Server } from 'socket.io'

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "https://bt792gm6-5173.inc1.devtunnels.ms",  // 
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