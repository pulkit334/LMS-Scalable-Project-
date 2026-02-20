const express = require("express");
const { auth, isstudent } = require("../middlewares/auth");
const { GetAiRoute, GetAiNotesRoute, DownloadNotes } = require("../controllers/Ai-service");
const router = express.Router();
router.get("/GetQuestions/:lectureId/questions",auth,isstudent,GetAiRoute)
router.post("/GetNotes/:subsectionId/notes",auth,isstudent,GetAiNotesRoute)
router.get("/DownloadNotes/:subsectionId", auth, isstudent, DownloadNotes);
module.exports = router