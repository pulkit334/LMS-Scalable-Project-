const cron = require("node-cron");

const task = () => {
    console.log("running a task", new Date());
};

// runs every minute
cron.schedule("* * * * * *", task);
