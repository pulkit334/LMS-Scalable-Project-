const cron = require("node-cron");
const fs = require("fs");
const path = require("path");

const archive = require("./archive.json");

const housekeeping = () => {
  try {
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
});
  } catch (err) {
    console.error("Error:", err);
  }
};

// Runs every minute
cron.schedule("* * * * * *", housekeeping);
