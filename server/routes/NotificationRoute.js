// const express = require("express");
// const {
//   saveFcmToken,
//   fetchNotification,
//   MarkReadOperations,
//   MarkDeleteOperations,
//   MarkAllReadOperations,
// } = require("../controllers/Notficationservice");
// const { auth } = require("../middlewares/auth");
// const { cacheMiddleware } = require("../middlewares/Caching");
// const router = express.Router();

// router.post("/user/save-fcm-token", auth, saveFcmToken);
// router.get("/user/user-notification",auth,  cacheMiddleware((req) => "Notificaiton-Main", 1), fetchNotification);
// router.patch("/user/status-updation", auth, MarkReadOperations);
// router.delete("/user/status-deletion", auth, MarkDeleteOperations);
// router.patch("/user/mark-all-read", auth, MarkAllReadOperations);
// module.exports = router;


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
const admin = require("../utils/utlis/firebase"); // ← ADD THIS LINE

const router = express.Router();

router.post("/user/save-fcm-token", auth, saveFcmToken);
router.get("/user/user-notification", auth, cacheMiddleware((req) => "Notificaiton-Main", 1), fetchNotification);
router.patch("/user/status-updation", auth, MarkReadOperations);
router.delete("/user/status-deletion", auth, MarkDeleteOperations);
router.patch("/user/mark-all-read", auth, MarkAllReadOperations);

// Test notification route
router.post('/test-notification', async (req, res) => {
  const token = 'c2ZulKqk_UVo4kWUlHun6V:APA91bECQsEV6oKOAW0T4HE4P_UPX0etWUAYmajlKtZQg1sRf4BRs2HUPa1gxy0l5CcU7iTK4kY0GriMjmzhPAzb-DePOyrVO_yxJFjlgwfFCY6-Qv-6T5I';
  
  const message = {
    notification: {
      title: 'TEST NOTIFICATION',
      body: 'Can you see this?',
    },
    token: token,
    android: {
      priority: 'high',
      notification: {
        channelId: 'default', // Add this
        sound: 'default',     // Add this
      }
    },
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('✅ Test notification sent:', response);
    res.json({ success: true, messageId: response });
  } catch (error) {
    console.error('❌ Test failed:', error);
    res.json({ success: false, error: error.message });
  }
});

module.exports = router; // Don't forget this if it's missing