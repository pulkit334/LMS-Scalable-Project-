const cron = require("node-cron");
const fs = require("fs");
const path = require("path");

const archive = require("./archive.json");

const housekeeping = () => {
  try {
    console.log("Running archive invoice task:", new Date());

    archive.forEach((item, index) => {
      const presentDate = Date.now();
      const recordDate = new Date(item.date).getTime();

      const daysDiff = Math.floor(
        (presentDate - recordDate) / (1000 * 60 * 60 * 24)
      );
      if( Math.floor(
        (presentDate - recordDate) / (1000 * 60 * 60 * 24)
      )){
        archive.splice(index,1);
        fs.writeFileSync(
            path.dirname(__dirname,"./archive.json"),
            JSON.stringify(archive),
            "utf-8"
        )
      }

      console.log(`Invoice ${index + 1} is ${daysDiff} days old`);
    });
  } catch (err) {
    console.error("Error:", err);
  }

  console.log("Task done ");
};

// Runs every minute
cron.schedule("* * * * * *", housekeeping);
