const express = require("express");
const { webHookEndPoint } = require("../controllers/WebhookReciver");
const { auth, isstudent } = require("../middlewares/auth");
const router = express.Router();


router.post("/webhooks/cloudinary",webHookEndPoint)


module.exports = router