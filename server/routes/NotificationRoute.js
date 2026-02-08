const express = require("express");
const { saveFcmToken } = require("../controllers/Notficationservice");
const { auth } = require("../middlewares/auth");
const router = express.Router();


router.post("/user/save-fcm-token",auth,saveFcmToken);
module.exports = router;