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
    canPublishData: true, // Enable real-time chat, reactions, and hand raise
    canPublishSources: isTeacher
      ? [TrackSource.CAMERA, TrackSource.MICROPHONE, TrackSource.SCREEN_SHARE]
      : [],
  });
  return token.toJwt();
};

export const updateParticipantPermissions = async (
  roomName,
  identity,
  { allowSpeak = false, allowCamera = false, allowChat = true } = {}
) => {
  const sources = [];
  if (allowSpeak) sources.push(TrackSource.MICROPHONE);
  if (allowCamera) sources.push(TrackSource.CAMERA);
  const canPublish = sources.length > 0;

  // Mute active mic/cam tracks immediately if revoked
  try {
    const participant = await roomService.getParticipant(String(roomName), String(identity));
    for (const track of participant?.tracks || []) {
      if (track.source === TrackSource.MICROPHONE && !allowSpeak && !track.muted) {
        await roomService.mutePublishedTrack(String(roomName), String(identity), track.sid, true);
      }
      if (track.source === TrackSource.CAMERA && !allowCamera && !track.muted) {
        await roomService.mutePublishedTrack(String(roomName), String(identity), track.sid, true);
      }
    }
  } catch (_) {
    // Participant may not have published tracks yet
  }

  return await roomService.updateParticipant(String(roomName), String(identity), {
    permission: {
      canSubscribe: true,
      canPublish,
      canPublishData: Boolean(allowChat),
      canPublishSources: sources,
    },
  });
};

export const muteAllStudents = async (roomName, teacherIdentity) => {
  const participants = await roomService.listParticipants(String(roomName));
  const results = [];

  for (const p of participants) {
    if (String(p.identity) === String(teacherIdentity)) continue;

    for (const track of p.tracks || []) {
      if (
        (track.source === TrackSource.MICROPHONE || track.source === TrackSource.CAMERA) &&
        !track.muted
      ) {
        try {
          await roomService.mutePublishedTrack(String(roomName), p.identity, track.sid, true);
        } catch (_) {}
      }
    }

    try {
      await roomService.updateParticipant(String(roomName), p.identity, {
        permission: {
          canSubscribe: true,
          canPublish: false,
          canPublishData: p.permission?.canPublishData ?? true,
          canPublishSources: [],
        },
      });
      results.push(p.identity);
    } catch (_) {}
  }

  return results;
};

export const removeParticipantFromRoom = async (roomName, identity) => {
  return await roomService.removeParticipant(String(roomName), String(identity));
};

export const updateClassroomMetadata = async (roomName, metadataObj) => {
  return await roomService.updateRoomMetadata(
    String(roomName),
    JSON.stringify(metadataObj || {})
  );
};
