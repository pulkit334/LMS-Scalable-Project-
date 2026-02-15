const cron = require("node-cron");
const Cart = require("../models/cart");
const mailsender = require("../utils/mailpotp");
const { sendNotifications } = require("../service/notification-queue-service");
const { generateCartReminderEmail } = require("../mail template/cartReminder");
const User = require("../models/User");
const Notification = require("../models/notification")

const checkAbandonedCarts= async () => {
  try {
    const now = Date.now();
    const threshold = 24 * 60 * 60 * 1000;
    const cutoffTime = now - threshold;

    const carts = await Cart.find({
      createdAt: { $lt: cutoffTime },
      reminderSent: false,
      itemCount: { $gt: 0 },
    });

    if (!carts || carts.length === 0) {
      return;
    }

    for (const cart of carts) {
      try {
        const user = await User.findById(cart.user).select("email name fcmToken");

        if (!user) {
          continue;
        }

        if (cart.itemCount >= 10) {
          const htmlEmail = generateCartReminderEmail(user, cart, process.env.FRONTEND_URL);
          await mailsender(user.email, "Cart Reminder - Notions-X", htmlEmail);

          if (user.fcmToken) {
            const title = " Cart Reminder";
            const body = `You have ${cart.itemCount} courses waiting! Total: ₹${cart.totalPrice}`;
            const deviceTokens = [user.fcmToken];
            const image = cart.items[0]?.thumbnail || null;

            await sendNotifications(title, body, deviceTokens, image);

            await Notification.create({
              userId: user._id,
              title: title,
              body: body,
              type: 'cart_reminder',
              image: image,
              isRead: false,
            });
          }
        } else {
          if (user.fcmToken) {
            const title = "Cart Reminder";
            const body = `You have ${cart.itemCount} course${cart.itemCount > 1 ? "s" : ""} waiting! Total: ₹${cart.totalPrice}`;
            const deviceTokens = [user.fcmToken];
            const image = cart.items[0]?.thumbnail || null;

            await sendNotifications(title, body, deviceTokens, image);

            await Notification.create({
              userId: user._id,
              title: title,
              body: body,
              type: 'cart_reminder',
              image: image,
              isRead: false,
            });
          }
        }

        cart.reminderSent = true;
        cart.reminderSentAt = new Date();
        cart.reminderType = cart.itemCount >= 10 ? "email_and_notification" : "notification_only";
        await cart.save();

      } catch (error) {
        console.error(`Error processing cart ${cart._id}:`, error.message);
      }
    }
  } catch (err) {
    console.error("Error in checkAbandonedCarts:", err);
  }
};

cron.schedule("*/30 * * * *", () => {
  checkAbandonedCarts();
});

if (process.env.NODE_ENV === "development") {
  checkAbandonedCarts();
}

module.exports = { checkAbandonedCarts };