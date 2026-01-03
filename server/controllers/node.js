const crypto = require("crypto");

const secret = "12345678";

const rawBody =
'{"payload":{"payment":{"entity":{"notes":{"course_id":"6952cefcb78c4ec5acd61392","userid":"6952b4193d33d28e04600b48"}}}}}';

const signature = crypto
  .createHmac("sha256", secret)
  .update(rawBody)
  .digest("hex");

console.log("VALID SIGNATURE:", signature);
