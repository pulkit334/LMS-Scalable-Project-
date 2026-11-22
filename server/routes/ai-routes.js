const express = require("express");
const { auth, isstudent } = require("../middlewares/auth");
const {
  GetAiRoute,
  GetAiNotesRoute,
  DownloadNotes,
  AskLectureTutor,
  SubmitQuizAttempt,
} = require("../controllers/Ai-service");
const router = express.Router();

router.get("/GetQuestions/:lectureId/questions", auth, isstudent, GetAiRoute);
router.post("/GetNotes/:subsectionId/notes", auth, isstudent, GetAiNotesRoute);
router.get("/DownloadNotes/:subsectionId", auth, isstudent, DownloadNotes);
router.post("/AskTutor/:subsectionId", auth, isstudent, AskLectureTutor);
router.post("/SubmitQuiz/:lectureId", auth, isstudent, SubmitQuizAttempt);

module.exports = router;
