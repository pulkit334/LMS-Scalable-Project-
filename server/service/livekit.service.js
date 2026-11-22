import { AccessToken, TrackSource } from "livekit-server-sdk";
import { roomService } from "../config/livekit.js";

export const createRoom = async (roomName) => {
  return await roomService.createRoom({
    name: roomName,
    emptyTimeout: 300,
    maxParticipants: 1000,
  });
};

export const deleteRoom = async (roomName) => {
  return await roomService.deleteRoom(roomName);
};

export const generateToken = (roomName, userId, isTeacher, participantName = "") => {
  const token = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    {
      identity: String(userId),
      name: participantName || (isTeacher ? "Instructor" : "Student"),
    }
  );
  token.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: isTeacher,
    canSubscribe: true,
    canPublishData: true, // Enable real-time chat for both teacher & students
    canPublishSources: isTeacher
      ? [TrackSource.CAMERA, TrackSource.MICROPHONE, TrackSource.SCREEN_SHARE]
      : [],
  });
  return token.toJwt();
};
