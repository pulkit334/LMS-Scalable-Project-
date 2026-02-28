const express = require("express");
const { auth, isinstructor, isstudent } = require("../middlewares/auth");
const {
  JoinRoom,
  CreateRoom,
  EndRoom,
  createClass,
  getRoomParticipants,
  livekitWebhook,
  getLiveSignal,
} = require("../controllers/livekit.controller.js");
const router = express.Router();

router.post("/live/create", auth, isinstructor, createClass);
router.post("/live/:classId/start", auth, isinstructor, CreateRoom);
router.post("/live/:classId/join", auth, isstudent, JoinRoom);
router.post("/live/:classId/end", auth, isinstructor, EndRoom);
router.get("/live/:classId/participants", auth, getRoomParticipants);
router.get("/live/verifying-classes", auth, livekitWebhook);
router.get("/live/:courseId/re-checking", auth, getLiveSignal);
module.exports = router;

