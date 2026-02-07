const NotificationService = require("../service/notifcaitonservice");

const sendFirebaseNotification = async (req, res) => {
  try {
    console.log("Controller hit! Request body:", req.body);
    
    const { title, body, deviceToken ,  image} = req.body;
    
    // Validate input
    if (!deviceToken || !title || !body) {
      console.log("Validation failed - missing fields");
      return res.status(400).json({ 
        success: false, 
        error: "Missing required fields: deviceToken, title, body" 
      });
    }
    
    console.log("Controller sending notification:", { title, body, deviceToken });
    
    await NotificationService.sendNotification(title, body, deviceToken,  image);
    
    res.status(200).json({ 
      message: "Notification sent successfully", 
      success: true 
    });
  } catch (err) {
    console.error("Controller error:", err);
    res.status(500).json({
      message: "Error sending notification",
      success: false,
      error: err.message
    });
  }
};


const sendFireMultipleNotification = async (req, res) => {
  try {
    const { title, body, deviceTokens,  image } = req.body;

    if (!title || !body || !Array.isArray(deviceTokens)) {
      return res.status(400).json({
        success: false,
        message: "title, body and deviceTokens[] are required",
      });
    }

    const response =
      await NotificationService.sendMultipleNotification(
        title,
        body,
        deviceTokens,
        image
      );

    return res.status(200).json({
      success: true,
      message: "Notifications sent",
      data: response,
    });
  } catch (error) {
    console.error("Controller error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  sendFireMultipleNotification,
};

module.exports = { sendFirebaseNotification ,sendFireMultipleNotification};