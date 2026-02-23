import {RoomServiceClient} from 'livekit-server-sdk'
import dotenv from "dotenv"
dotenv.config();


export const roomService = new RoomServiceClient(
 process.env.LIVEKIT_URL,
  process.env.LIVEKIT_API_KEY,
  process.env.LIVEKIT_API_SECRET
)
