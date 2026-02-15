const { Worker } = require("bullmq");
const IORedis = require("ioredis");
const NotificationService = require("./notifcaitonservice");

const connection = new IORedis({
  maxRetriesPerRequest: null,
});

// worker creating 
const worker = new Worker(
  "Notification-Queue",
  async (job) => {
    const response =
      await NotificationService.sendMultipleNotification(
        job.data.title,
        job.data.body,
        job.data.deviceTokens,
        job.data.image
      );
    return response;
  },
  {
    connection,
    concurrency: 5,
  }
);

worker.on("completed", (job) => {
  console.log("job completed:", job.id);
});

worker.on("failed", (job, err) => {
  console.error(` Job ${job?.id} failed:`, err);
});


