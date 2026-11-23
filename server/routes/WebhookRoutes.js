const express = require("express");
const { webHookEndPoint } = require("../controllers/WebhookReciver");
const { auth, isstudent } = require("../middlewares/auth");
const { livekitWebhook } = require("../controllers/livekit.controller");
const router = express.Router();


router.post("/webhooks/cloudinary",webHookEndPoint,livekitWebhook)


module.exports = router