import { AccessToken ,TrackSource} from "livekit-server-sdk"
import { roomService } from '../config/livekit.js'

export const createRoom = async (roomName)=>{
    return await roomService.createRoom({
        name : roomName,
        emptyTimeout: 300,
        maxParticipants : 1000,
        
    })
}

export const deleteRoom = async (roomName)=>{
    return await roomService.deleteRoom(roomName);
}
export const generateToken = (roomName, userId, isTeacher) => {
    const token = new AccessToken(
        process.env.LIVEKIT_API_KEY,
        process.env.LIVEKIT_API_SECRET,
        { identity: String(userId) }
    )
    token.addGrant({
        roomJoin: true,
        room: roomName,
        canPublish: isTeacher,
        canSubscribe: true,
        canPublishData : isTeacher,
     canPublishSources: isTeacher 
            ? [TrackSource.CAMERA, TrackSource.MICROPHONE, TrackSource.SCREEN_SHARE]
            : [TrackSource.CAMERA],
        
    })
    return token.toJwt()
}