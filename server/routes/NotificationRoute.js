const express = require("express");
const { saveFcmToken ,fetchNotification} = require("../controllers/Notficationservice");
const { auth } = require("../middlewares/auth");
const router = express.Router();

router.post("/user/save-fcm-token", auth, saveFcmToken);
router.get("/user/user-notification", auth,fetchNotification);
module.exports = router;
