const express = require("express");
const {
  saveFcmToken,
  fetchNotification,
  MarkReadOperations,
  MarkDeleteOperations,
  MarkAllReadOperations,
} = require("../controllers/Notficationservice");
const { auth } = require("../middlewares/auth");
const { cacheMiddleware } = require("../middlewares/Caching");
const router = express.Router();

router.post("/user/save-fcm-token", auth, saveFcmToken);
router.get("/user/user-notification",auth,  cacheMiddleware((req) => "Notificaiton-Main", 100), fetchNotification);
router.patch("/user/status-updation", auth, MarkReadOperations);
router.delete("/user/status-deletion", auth, MarkDeleteOperations);
router.patch("/user/mark-all-read", auth, MarkAllReadOperations);
module.exports = router;
