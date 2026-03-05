const { Queue } = require("bullmq");
const IORedis = require("ioredis");
const NotificationService = require("./notifcaitonservice");
const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  tls: process.env.REDIS_URL?.startsWith("rediss://")
    ? { rejectUnauthorized: false }
    : undefined,
})
const notificationQueue = new Queue("notification-queue", { connection });

const Thershold_Value = 100;

async function sendNotifications(title, body, deviceTokens, image = null) {
  console.log(
    "the queue notification send data would be ",
    title,
    body,
    deviceTokens,
    image,
  );
  if (deviceTokens.length < Thershold_Value) {
    //direct send to the Users
    console.log("the device token would be ", deviceTokens);
    const response = await NotificationService.sendMultipleNotification(
      title,
      body,
      deviceTokens,
      image,
    );
    return {
      method: "direct",
      successCount: response.successCount,
      failureCount: response.failureCount,
    };
  }

  // Value

  //batches bane ge
  const batches = [];
  for (let i = 0; i < deviceTokens.length; i += 500) {
    batches.push(deviceTokens.slice(i, i + 500));
  }
  const jobId = [];
  for (let i = 0; i < batches.length; i++) {
    const result = await notificationQueue.add(
      "send-notification",
      {
        title,
        body,
        deviceTokens: batches[i],
        image,
        BatchNumber: i + 1,
        totalBatches: batches.length,
      },
      {
        attempts: 3,

        backoff: {
          type: "exponential",
          delay: 1000,
        },
      },
    );
    jobId.push(result.id);
  }
  return {
    method: "queued",
    totalUsers: deviceTokens.length,
    batches: batches.length,
    jobId,
  };
}
module.exports = { sendNotifications };
