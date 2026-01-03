const crypto = require("crypto");

const secret = "12345678";

const rawBody =
'{"payload":{"payment":{"entity":{"notes":{"course_id":"69594fe7da69c1dd9000f9a4","userid":"6957a5382d44d3658f2c8b26"}}}}}';

const signature = crypto
  .createHmac("sha256", secret)
  .update(rawBody)
  .digest("hex");

console.log("VALID SIGNATURE:", signature);
