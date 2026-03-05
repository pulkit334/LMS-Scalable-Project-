const { Worker } = require("bullmq");
const IORedis = require("ioredis");
const NotificationService = require("./notifcaitonservice");

const connection = new IORedis({ maxRetriesPerRequest: null });

const worker = new Worker(
  "Notification-Queue",
  async (job) => {
    const { title, body, deviceTokens, image } = job.data;

    if (!deviceTokens?.length) {
      throw new Error("No device tokens provided");
    }

    const response = await NotificationService.sendMultipleNotification(
      title, body, deviceTokens, image
    );

    if (response.failureCount > 0) {
      throw new Error(`${response.failureCount} notifications failed`);
    }

    return response;
  },
  {
    connection,        //  merged here
    concurrency: 5,
    removeOnComplete: {
      age: 3600,
      count: 1000,
    },
    removeOnFail: {
      age: 24 * 3600,
    },
    settings: {
      backoffStrategy: (attemptsMade) => {
        return 4000 * attemptsMade;
      },
    },
  }  //  single 3rd argument
);

// only fires when ALL retries are exhausted
worker.on("failed", (job, err) => {
  if (job?.attemptsMade >= job?.opts?.attempts) {
    console.error(
      `Job ${job?.id} permanently failed after ${job?.attemptsMade} attempts — tokens: ${job?.data?.deviceTokens?.length}:`,
      err.message
    );
    //  you can add alerting here later (Slack, email, Sentry etc.)
  }
});

worker.on("completed", (job) => {
  console.log("job completed:", job.id);
});
