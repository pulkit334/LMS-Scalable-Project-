const { Queue } = require("bullmq");
const IORedis = require("ioredis");
const NotificationService = require("./notifcaitonservice");
const connection = new IORedis({ maxRetriesPerRequest: null });
const notificationQueue = new Queue("notification-queue", { connection });

const Thershold_Value = 100;

async function sendNotifications(title, body, deviceTokens, image = null) {
  console.log("the queue notification send data would be ",title,body,deviceTokens,image)
  if (deviceTokens.length < Thershold_Value) {
    //direct send to the Users
    console.log("the device token would be ",deviceTokens)
    const response =await NotificationService.sendMultipleNotification(
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

  console.log(" Adding to queue (>= 100 users)");
  //batches bane ge
  const batches = [];
  for (let i = 0; i < deviceTokens.length; i += 500) {
    batches.push(deviceTokens.slice(i, i + 500));
  }
  const jobId = [];
  for (let i = 0; i < batches.length; i++) {
    const result = await notificationQueue.add("send-notification", {
      title,
      body,
      deviceTokens: batches[i],
      image,
      BatchNumber: i + 1,
      totalBatches: batches.length,
    });
    jobId.push(result.id);
    console.log(
      ` Batch ${i + 1}/${batches.length} queued (${batches[i].length} tokens)`,
    );
  }
  //then push through the produces then
  return {
    method: "queued",
    totalUsers: deviceTokens.length,
    batches: batches.length,
    jobId,
  };
}
module.exports = {sendNotifications}