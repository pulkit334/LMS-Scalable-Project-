import { RoomServiceClient } from "livekit-server-sdk";

const svc = new RoomServiceClient(
  "wss://pulkit-cqzbu469.livekit.cloud",
  "APIZVZUKM6efYit",
  "OlehGD8g7DlOHDwgGVPC817EhzqeoVR57uOeNcPZhczA"
);

async function monitor() {
  setInterval(async () => {
    const participants = await svc.listParticipants("69a1d24ebe277d23c6383c23");
    console.clear();
    console.log("Live Students in Room:");
    console.log("Total:", participants.length);
  }, 100); // refresh every 2 seconds
}

monitor();