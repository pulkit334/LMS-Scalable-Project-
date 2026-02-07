const express = require("express");
const app = express();
const PORT = 500;
const bodyparser = require("body-parser");
const firebaseRoute = require("./src/routes/firebaseroutes");
const cors = require("cors");
const NotificationService = require("./src/service/notifcaitonservice");
// const cron = require("node-cron");
app.use(cors());
app.use(bodyparser.json());

app.get("/", (req, res) => {
  res.send(`App is listening on port ${PORT}`);
});



async function sendeverynotificaiton() {
  const title = "Every Notification";
  const body = "Hello From Your Body";
  const deviceToken = "dNXKswSwCrg8mSgVgamWPQ:APA91bFowndR5ZX2zH_UgtfzavarA2jvscjdJJwJa2D6X0yTxLwZPK1utgtrW_7W2jkBTGjwdE6DMlVW0MV7q2boK5qUIFtpG6xjpPdNQBvw_OBPSSw4-sg";
  
  try {
    await NotificationService.sendNotification(title, body, deviceToken);
    console.log("Cron: Notification sent successfully");
  } catch (error) {
    console.error("Cron: Error sending notification:", error);
  }
}

// // Send notification every 20 seconds
// cron.schedule("*/20 * * * * *", async () => {
//   console.log("Cron job running - sending notification");
//   await sendeverynotificaiton();
// });

app.listen(PORT, () => {
  console.log(`Successfully started the server on port ${PORT}`);
});

