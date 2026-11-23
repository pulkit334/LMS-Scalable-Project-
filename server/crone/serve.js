const express = require("express");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 5001;
// require("./s1");
require("./s3")
const app = express();

app.use(express.json());

app.listen(port, () => {
});
