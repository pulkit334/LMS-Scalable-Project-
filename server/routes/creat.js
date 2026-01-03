const crypto = require("crypto");

const secret = "12345678";

const body = `{"payload":{"payment":{"entity":{"notes":{"course_id":"693abd125f2fb9338cf8119b","userid":"693abd125f2fb9338cf8119b"}}}}`;

const signature = crypto
  .createHmac("sha256", secret)
  .update(body)
  .digest("hex");

console.log(signature);
