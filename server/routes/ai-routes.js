const express = require("express");
const { auth, isstudent } = require("../middlewares/auth");
const { GetAiRoute } = require("../controllers/Ai-service");
const router = express.Router();
router.get("/GetQuestions/:lectureId/questions",auth,isstudent,GetAiRoute)

module.exports = router 