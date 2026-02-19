const admin = require("../utils/utlis/firebase");

class NotificationService {
  // single device
  static async sendNotification(title, body, deviceToken, image) {
    console.log({ title, body, deviceToken });
    
    const message = {
      notification: { 
        title, 
        body,
        ...(image && { image })
      },
      token: deviceToken,
      webpush: {
        headers: { 
          Urgency: "high",
          TTL: "0"
        },
        notification: { 
          requireInteraction: true,   
          ...(image && { image: image })
        },
      },
    };

    return admin.messaging().send(message);
  }

  static async sendMultipleNotification(title, body, deviceTokens, image) {
    if (!Array.isArray(deviceTokens) || deviceTokens.length === 0) {
      throw new Error("deviceTokens must be a non-empty array");
    }

    const message = {
      notification: { 
        title, 
        body,
        ...(image && { image })
      },
      tokens: deviceTokens,
      webpush: {
        headers: { 
          Urgency: "high",
          TTL: "0"  // Time to live - 0 means deliver immediately or not at all
        },
        notification: {
          requireInteraction: true,
          ...(image && { image: image }),
          // Add these for better web notification display
          badge: image,
          icon: image,
          tag: 'cart-reminder',  // Prevents duplicate notifications
          renotify: false,
        },
      },
    };

    console.log('📤 Sending web notification...');
    const response = await admin.messaging().sendEachForMulticast(message);
    
    console.log('✅ Success:', response.successCount);
    console.log('❌ Failed:', response.failureCount);
    
    return response;
  }
}

module.exports = NotificationService; 