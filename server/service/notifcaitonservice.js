const admin = require("../utils/utlis/firebase");

class NotificationService {
  // single device
  static async sendNotification(title, body, deviceToken,image) {
    const message = {
      notification: { title, body,image },
      token: deviceToken,
      webpush: {
        headers: { Urgency: "high" },
        notification: { requireInteraction: true },
      },
    };

    return admin.messaging().send(message);
  }


  static async sendMultipleNotification(title, body, deviceTokens,image) {
    if (!Array.isArray(deviceTokens) || deviceTokens.length === 0) {
      throw new Error("deviceTokens must be a non-empty array");
    }

    const message = {
      notification: { title, body,image },
      tokens: deviceTokens, //
      webpush: {
        headers: { Urgency: "high" },
      },
    };

    const response = await admin.messaging().sendEachForMulticast(message);

    console.log("Success:", response.successCount);
    console.log("Failure:", response.failureCount);

    return response;
  }
}

module.exports = NotificationService;
