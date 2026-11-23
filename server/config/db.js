const mongoose = require("mongoose");
require("dotenv").config();

const connect = () => {
  try {
    mongoose.connect(process.env.DB_URL, {});
} catch (err) {
    console.error("DB connection error:", err);
    process.exit(1);
  }
};

module.exports = connect;
