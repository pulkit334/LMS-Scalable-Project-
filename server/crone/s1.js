const cron = require("node-cron");

const task = () => {
};

// runs every minute
cron.schedule("* * * * * *", task);
