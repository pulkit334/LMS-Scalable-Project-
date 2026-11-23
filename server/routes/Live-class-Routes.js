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
  updateStudentPermissions,
  muteAllStudentsController,
  kickParticipant,
  updateRoomSettings,
} = require("../controllers/livekit.controller.js");
const router = express.Router();

router.post("/live/create", auth, isinstructor, createClass);
router.post("/live/:classId/start", auth, isinstructor, CreateRoom);
router.post("/live/:classId/join", auth, isstudent, JoinRoom);
router.post("/live/:classId/end", auth, isinstructor, EndRoom);
router.post("/live/:classId/permissions", auth, isinstructor, updateStudentPermissions);
router.post("/live/:classId/mute-all", auth, isinstructor, muteAllStudentsController);
router.post("/live/:classId/kick", auth, isinstructor, kickParticipant);
router.post("/live/:classId/settings", auth, isinstructor, updateRoomSettings);
router.get("/live/:classId/participants", auth, getRoomParticipants);
router.get("/live/verifying-classes", auth, livekitWebhook);
router.get("/live/:courseId/re-checking", auth, getLiveSignal);
module.exports = router;
