const express = require("express");
const router = express.Router();
const { sendFirebaseNotification ,sendFireMultipleNotification} = require("../controllers/firebase");

router.post("/send-notification", sendFirebaseNotification);
router.post("/send-Multiplenotification", sendFireMultipleNotification);

module.exports = router;